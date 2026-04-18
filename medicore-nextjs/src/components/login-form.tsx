"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "@/server/actions";

type FormState = { error?: string };
const initialState: FormState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-bold text-[#31534a]">Username</label>
        <input
          name="username"
          className="field"
          placeholder="admin"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-bold text-[#31534a]">Password</label>
        <input
          name="password"
          type="password"
          className="field"
          placeholder="Password"
        />
      </div>
      {state?.error ? <p className="rounded-lg bg-[#ffe8e4] px-3 py-2 text-sm font-semibold text-[#b5413b]">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="btn btn-primary w-full disabled:opacity-60"
      >
        {pending ? "Logging in..." : "Login"}
      </button>
      <p className="text-sm font-medium text-[#61736c]">
        No account?{" "}
        <Link className="font-black text-[#0f8f72] hover:underline" href="/signup">
          Sign up
        </Link>
      </p>
    </form>
  );
}
