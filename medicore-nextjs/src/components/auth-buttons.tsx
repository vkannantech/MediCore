"use client";

import { useTransition } from "react";
import { logoutAction } from "@/server/actions";

export function LogoutButton() {
  const [pending, startTransition] = useTransition();
  return (
    <button
      className="btn btn-danger btn-compact disabled:opacity-60"
      onClick={() => startTransition(async () => logoutAction())}
      disabled={pending}
      type="button"
    >
      {pending ? "Signing out..." : "Logout"}
    </button>
  );
}
