"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signupAction } from "@/server/actions";

type FormState = { error?: string };
const initialState: FormState = {};

export function SignupForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(signupAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-bold text-[#31534a]">Username</label>
        <input
          name="username"
          className="field"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-bold text-[#31534a]">Password</label>
        <input
          name="password"
          type="password"
          className="field"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-bold text-[#31534a]">Confirm Password</label>
        <input
          name="confirm"
          type="password"
          className="field"
        />
      </div>
      {state?.error ? <p className="rounded-lg bg-[#ffe8e4] px-3 py-2 text-sm font-semibold text-[#b5413b]">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="btn btn-primary w-full disabled:opacity-60"
      >
        {pending ? "Creating..." : "Create Account"}
      </button>
      <p className="text-sm font-medium text-[#61736c]">
        Already have an account?{" "}
        <Link className="font-black text-[#0f8f72] hover:underline" href="/login">
          Login
        </Link>
      </p>
    </form>
  );
}
