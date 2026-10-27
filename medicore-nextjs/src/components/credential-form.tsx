"use client";

import { useActionState } from "react";

export type CredentialState = { username?: string; password?: string; error?: string };

/**
 * Creates or resets a patient's portal login and shows the new password once.
 * The password is never stored in plain text, so it cannot be displayed again later.
 */
export function CredentialForm({
  action,
  patientId,
  hasLogin,
}: {
  action: (state: CredentialState, formData: FormData) => Promise<CredentialState>;
  patientId: number;
  hasLogin: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="patientId" value={patientId} />
      <button className="btn btn-secondary btn-compact w-full disabled:opacity-60" disabled={pending}>
        {pending ? "Working..." : hasLogin ? "Reset Password" : "Create Login"}
      </button>
      {state.error ? <p className="text-xs font-bold text-[#b5413b]">{state.error}</p> : null}
      {state.password ? (
        <p className="rounded-lg border border-[#b9e6d3] bg-[#e2f7ed] p-2 text-xs font-bold text-[#0f765f]">
          Username: <code className="select-all">{state.username}</code>
          <br />
          Password: <code className="select-all">{state.password}</code>
          <br />
          <span className="font-semibold">Share it now; it will not be shown again.</span>
        </p>
      ) : null}
    </form>
  );
}
