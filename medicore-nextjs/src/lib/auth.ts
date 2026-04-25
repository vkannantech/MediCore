import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "medicore_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (process.env.NODE_ENV === "production" && (!secret || secret === "change-me" || secret.length < 32)) {
    throw new Error("JWT_SECRET must be set to a strong value in production.");
  }

  return new TextEncoder().encode(secret || "change-me");
}

const JWT_SECRET = getJwtSecret();
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

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

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
