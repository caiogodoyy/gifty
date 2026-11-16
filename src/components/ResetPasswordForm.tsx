"use client";

import Link from "next/link";
import { useState } from "react";
import { useFormState } from "react-dom";
import { SubmitButton } from "./SubmitButton";
import { resetPassword } from "@/lib/actions/auth";
import { PASSWORD_RULES, passwordValid } from "@/lib/validation";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action] = useFormState(resetPassword, undefined);
  const [password, setPassword] = useState("");

  return (
    <form action={action} className="card space-y-4">
      <h1 className="text-xl font-semibold">Nova senha</h1>
      <input type="hidden" name="token" value={token} />
      <input
        className="input"
        type="password"
        name="password"
        placeholder="Nova senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
        required
      />
      <ul className="space-y-0.5 text-xs" aria-live="polite">
        {PASSWORD_RULES.map((r) => {
          const ok = r.test(password);
          return (
            <li key={r.id} className={ok ? "text-sage-700" : "text-ink-soft"}>
              {ok ? "✓" : "○"} {r.label}
            </li>
          );
        })}
      </ul>
      {state?.error && (
        <p className="text-sm text-terracotta-700">
          {state.error} <Link href="/forgot-password" className="underline">Pedir novo link</Link>
        </p>
      )}
      <SubmitButton disabled={!passwordValid(password)} className="btn w-full">Redefinir senha</SubmitButton>
    </form>
  );
}
