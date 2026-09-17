"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button, Input } from "@/components/ui";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <Input
          type="email"
          name="email"
          placeholder="Email address"
          autoComplete="email"
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          autoComplete="current-password"
          required
        />
      </div>

      <div className="text-right">
        <Link href="/forgot-password" className="font-sans text-xs text-faint">
          Forgot password?
        </Link>
      </div>

      {state?.error && (
        <p className="font-sans text-[13px] text-status-error">{state.error}</p>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Logging in..." : "Log in"}
      </Button>

      <div className="text-center font-sans text-[13px] text-faint">
        New to AUXDROP?{" "}
        <Link href="/signup" className="font-semibold text-on-dark">
          Sign up
        </Link>
      </div>
    </form>
  );
}
