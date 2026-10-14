"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { SubmitButton } from "./SubmitButton";
import { login, register } from "@/lib/actions/auth";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const [state, action] = useFormState(mode === "login" ? login : register, undefined);
  const isLogin = mode === "login";

  return (
    <form action={action} className="card space-y-4">
      <h1 className="text-xl font-semibold">{isLogin ? "Entrar" : "Criar conta"}</h1>
      {!isLogin && <input className="input" name="name" placeholder="Seu nome" autoComplete="name" required />}
      <input className="input" type="email" name="email" placeholder="E-mail" autoComplete="email" required />
      <input
        className="input"
        type="password"
        name="password"
        placeholder="Senha"
        minLength={isLogin ? undefined : 8}
        autoComplete={isLogin ? "current-password" : "new-password"}
        required
      />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <SubmitButton className="btn w-full">{isLogin ? "Entrar" : "Cadastrar"}</SubmitButton>
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
