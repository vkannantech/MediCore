import { randomInt } from "node:crypto";
import { cache } from "react";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "medicore_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

// Resolved lazily so `next build` can run without runtime secrets.
function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32 || secret.startsWith("change-me")) {
    throw new Error("JWT_SECRET must be set to a random value of at least 32 characters (see .env.example).");
  }
  return new TextEncoder().encode(secret);
}

function secureCookieEnabled() {
  const flag = process.env.COOKIE_SECURE;
  return flag ? flag === "true" : process.env.NODE_ENV === "production";
}
export type AppRole = "ADMIN" | "USER";

function normalizeRole(role: string | null | undefined): AppRole {
  return role === "ADMIN" ? "ADMIN" : "USER";
}

export type SessionPayload = {
  userId: number;
  username: string;
  role: AppRole;
  patientId: number | null;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

const PASSWORD_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";

/** Random one-time password for admin-created logins (shown once to the admin). */
export function generatePassword(length = 12) {
  return Array.from({ length }, () => PASSWORD_ALPHABET[randomInt(PASSWORD_ALPHABET.length)]).join("");
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: secureCookieEnabled(),
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/**
 * Verifies the cookie and re-reads the user from the database (once per request),
 * so deleted users and role changes take effect immediately instead of after 7 days.
 */
export const getSession = cache(async (): Promise<SessionPayload | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  // Outside the try: a missing secret is a config error, not an invalid session.
  const secret = getJwtSecret();
  let userId: number;
  try {
    const { payload } = await jwtVerify(token, secret);
    userId = Number(payload.userId);
  } catch {
    return null;
  }
  if (!Number.isInteger(userId)) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, role: true, patientId: true },
  });
  if (!user) return null;

  return { userId: user.id, username: user.username, role: normalizeRole(user.role), patientId: user.patientId };
});

export async function requireSession(requiredRole?: AppRole) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (requiredRole && session.role !== requiredRole) {
    if (session.role === "USER" && session.patientId) redirect("/user-dashboard");
    redirect("/dashboard");
  }
  return session;
}

export async function login(username: string, password: string) {
  const normalizedUsername = username.trim();
  const user = await prisma.user.findUnique({ where: { username: normalizedUsername } });
  if (!user) return { ok: false as const, message: "Invalid username or password." };

  let ok = await verifyPassword(password, user.password);
  if (!ok && user.password === password) {
    ok = true;
    await prisma.user.update({
      where: { id: user.id },
      data: { password: await hashPassword(password) },
    });
  }
  if (!ok) return { ok: false as const, message: "Invalid username or password." };

  const role = normalizeRole(user.role);
  if (role === "USER" && !user.patientId) {
    return { ok: false as const, message: "This user account is not linked to a patient profile. Ask an administrator to link it." };
  }

  await createSession({
    userId: user.id,
    username: user.username,
    role,
    patientId: user.patientId ?? null,
  });

  return { ok: true as const, user };
}

export async function signup(input: {
  username: string;
  password: string;
  name: string;
  age: number | null;
  gender: string;
  phone: string;
}) {
  const username = input.username.trim();
  const exists = await prisma.user.findUnique({ where: { username } });
  if (exists) return { ok: false as const, message: "Username already exists." };

  const hashed = await hashPassword(input.password);
  await prisma.$transaction(async (tx) => {
    const patient = await tx.patient.create({
      data: {
        name: input.name.trim(),
        age: input.age,
        gender: input.gender,
        phone: input.phone.trim(),
      },
    });

    await tx.user.create({
      data: {
        username,
        password: hashed,
        role: "USER",
        patientId: patient.patientId,
      },
    });
  });

  return { ok: true as const };
}
