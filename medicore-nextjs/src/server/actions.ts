"use server";

import { redirect } from "next/navigation";
import { clearSession, login, signup } from "@/lib/auth";

type ActionState = { error?: string };

export async function loginAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!username || !password) return { error: "Username and password are required." };

  const result = await login(username, password);
  if (!result.ok) return { error: result.message };

  if (result.user.role === "ADMIN") redirect("/dashboard");
  if (result.user.patientId) redirect("/user-dashboard");
  return { error: "User account is not linked to a patient profile." };
}

export async function signupAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!username || !password) return { error: "Username and password are required." };
  if (password.length < 4) return { error: "Password must be at least 4 characters." };
  if (password !== confirm) return { error: "Passwords do not match." };

  const result = await signup(username, password);
  if (!result.ok) return { error: result.message };
  redirect("/login?created=1");
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}
