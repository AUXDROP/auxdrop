"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Button, Input } from "@/components/ui";
import { signup, type SignupState } from "./actions";

const initialState: SignupState = {};

const ROLES = [
  { value: "BEATMAKER", label: "I'm a beatmaker", hint: "Compete in battles" },
  { value: "AUDIENCE", label: "I'm here to watch", hint: "Follow battles & discover music" },
] as const;

export function SignUpForm() {
  const [state, formAction, pending] = useActionState(signup, initialState);
  const [role, setRole] = useState<string>("BEATMAKER");

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="role" value={role} />

      {/* Not in the Sign Up mockup — added per instructions so role is
          chosen at signup rather than left undecided. */}
      <div className="grid grid-cols-2 gap-2">
        {ROLES.map((r) => (
          <button
            key={r.value}
            type="button"
            onClick={() => setRole(r.value)}
            className={
              "flex flex-col items-start gap-0.5 rounded-input border px-4 py-3 text-left transition-colors " +
              (role === r.value
                ? "border-accent bg-elevated"
                : "border-border bg-transparent hover:bg-elevated")
            }
          >
            <span className="font-sans text-[13px] font-bold text-on-dark">
              {r.label}
            </span>
            <span className="font-sans text-[11px] text-faint">{r.hint}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <Input
          type="email"
          name="email"
          placeholder="Email address"
          autoComplete="email"
          required
        />
        <Input
          type="text"
          name="handle"
          placeholder="Username"
          autoComplete="username"
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          autoComplete="new-password"
          required
        />
      </div>

      {state?.error && (
        <p className="font-sans text-[13px] text-status-error">{state.error}</p>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Creating account..." : "Create account"}
      </Button>

      <div className="text-center font-sans text-[13px] text-faint">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-on-dark">
          Log in
        </Link>
      </div>
    </form>
  );
}
