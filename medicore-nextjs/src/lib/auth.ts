import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "medicore_session";
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "change-me");
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
    maxAge: 60 * 60 * 24 * 7,
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
  const user = await prisma.user.findUnique({ where: { username } });
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

  await createSession({
    userId: user.id,
    username: user.username,
    role: normalizeRole(user.role),
    patientId: user.patientId ?? null,
  });

  return { ok: true as const, user };
}

export async function signup(username: string, password: string) {
  const exists = await prisma.user.findUnique({ where: { username } });
  if (exists) return { ok: false as const, message: "Username already exists." };

  const hashed = await hashPassword(password);
  await prisma.user.create({
    data: {
      username,
      password: hashed,
      role: "USER",
    },
  });
  return { ok: true as const };
}
