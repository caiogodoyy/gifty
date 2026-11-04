"use client";

import Link from "next/link";
import { useState } from "react";
import { useFormState } from "react-dom";
import { SubmitButton } from "./SubmitButton";
import { forgotPassword } from "@/lib/actions/auth";
import { EMAIL_RE } from "@/lib/validation";

export function ForgotPasswordForm() {
  const [state, action] = useFormState(forgotPassword, undefined);
  const [email, setEmail] = useState("");

  return (
    <form action={action} className="card space-y-4">
      <h1 className="text-xl font-semibold">Esqueceu a senha?</h1>
      <p className="text-sm text-stone-500">Informe seu e-mail e enviaremos um link para criar uma nova senha.</p>
      <input
        className="input"
        type="email"
        name="email"
        placeholder="E-mail"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.ok && <p className="text-sm text-sage-700">{state.ok}</p>}
      <SubmitButton disabled={!EMAIL_RE.test(email.trim())} className="btn w-full">Enviar link</SubmitButton>
      <p className="text-center text-sm text-stone-500">
        <Link href="/login" className="underline">Voltar para o login</Link>
      </p>
    </form>
  );
}
