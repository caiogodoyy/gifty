"use client";

import Link from "next/link";
import { useState } from "react";
import { useFormState } from "react-dom";
import { SubmitButton } from "./SubmitButton";
import { login, register } from "@/lib/actions/auth";
import { EMAIL_RE, PASSWORD_RULES, passwordValid } from "@/lib/validation";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const [state, action] = useFormState(mode === "login" ? login : register, undefined);
  const isLogin = mode === "login";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const emailOk = EMAIL_RE.test(email.trim());
  const canSubmit = isLogin || (emailOk && passwordValid(password));

  return (
    <form action={action} className="card space-y-4">
      <h1 className="text-xl font-semibold">{isLogin ? "Entrar" : "Criar conta"}</h1>
      {!isLogin && <input className="input" name="name" placeholder="Seu nome" autoComplete="name" required />}
      <div>
        <input
          className={`input ${!isLogin && emailTouched && email && !emailOk ? "border-red-400" : ""}`}
          type="email"
          name="email"
          placeholder="E-mail"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setEmailTouched(true)}
          required
        />
        {!isLogin && email && (emailTouched || emailOk) && (
          <p className={`mt-1 text-xs ${emailOk ? "text-sage-700" : "text-red-600"}`}>
            {emailOk ? "✓ E-mail válido" : "✗ Informe um e-mail válido (ex.: nome@dominio.com)"}
          </p>
        )}
      </div>
      <input
        className="input"
        type="password"
        name="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete={isLogin ? "current-password" : "new-password"}
        required
      />
      {!isLogin && (
        <ul className="space-y-0.5 text-xs" aria-live="polite">
          {PASSWORD_RULES.map((r) => {
            const ok = r.test(password);
            return (
              <li key={r.id} className={ok ? "text-sage-700" : "text-stone-500"}>
                {ok ? "✓" : "○"} {r.label}
              </li>
            );
          })}
        </ul>
      )}
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <SubmitButton disabled={!canSubmit} className="btn w-full">{isLogin ? "Entrar" : "Cadastrar"}</SubmitButton>
      <p className="text-center text-sm text-stone-500">
        {isLogin ? (
          <>Novo por aqui? <Link href="/register" className="underline">Crie sua conta</Link></>
        ) : (
          <>Já tem conta? <Link href="/login" className="underline">Entrar</Link></>
        )}
      </p>
    </form>
  );
}
