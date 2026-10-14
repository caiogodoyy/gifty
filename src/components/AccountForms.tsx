"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { SubmitButton } from "./SubmitButton";
import { changePassword, updateAccount } from "@/lib/actions/profile";
import { EMAIL_RE, PASSWORD_RULES, passwordValid } from "@/lib/validation";

export function AccountForms({ name, email }: { name: string; email: string }) {
  const [accState, accAction] = useFormState(updateAccount, undefined);
  const [pwState, pwAction] = useFormState(changePassword, undefined);
  const [newName, setNewName] = useState(name);
  const [newEmail, setNewEmail] = useState(email);
  const [newPassword, setNewPassword] = useState("");
  const emailChanged = newEmail.trim().toLowerCase() !== email;
  const emailOk = EMAIL_RE.test(newEmail.trim());

  return (
    <>
      <form action={accAction} className="card space-y-4">
        <h2 className="font-semibold">Dados da conta</h2>
        <label className="block space-y-1 text-sm">
          <span className="text-stone-600">Nome</span>
          <input className="input" name="name" value={newName} onChange={(e) => setNewName(e.target.value)} autoComplete="name" required />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="text-stone-600">E-mail</span>
          <input className="input" type="email" name="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} autoComplete="email" required />
          {!emailOk && <span className="text-xs text-red-600">✗ Informe um e-mail válido</span>}
        </label>
        {emailChanged && (
          <label className="block space-y-1 text-sm">
            <span className="text-stone-600">Senha atual (necessária para trocar o e-mail)</span>
            <input className="input" type="password" name="currentPassword" autoComplete="current-password" required />
          </label>
        )}
        {accState?.error && <p className="text-sm text-red-600">{accState.error}</p>}
        <div className="flex items-center gap-3">
          <SubmitButton disabled={!emailOk || newName.trim().length < 2}>Salvar dados</SubmitButton>
          {accState && !accState.error && <span className="text-sm text-stone-500">Salvo ✓</span>}
        </div>
      </form>

      <form action={pwAction} className="card space-y-4">
        <h2 className="font-semibold">Alterar senha</h2>
        <input className="input" type="password" name="currentPassword" placeholder="Senha atual" autoComplete="current-password" required />
        <input
          className="input"
          type="password"
          name="newPassword"
          placeholder="Nova senha"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
        <ul className="space-y-0.5 text-xs" aria-live="polite">
          {PASSWORD_RULES.map((r) => (
            <li key={r.id} className={r.test(newPassword) ? "text-sage-700" : "text-stone-500"}>
              {r.test(newPassword) ? "✓" : "○"} {r.label}
            </li>
          ))}
        </ul>
        {pwState?.error && <p className="text-sm text-red-600">{pwState.error}</p>}
        <div className="flex items-center gap-3">
          <SubmitButton disabled={!passwordValid(newPassword)}>Alterar senha</SubmitButton>
          {pwState && !pwState.error && <span className="text-sm text-stone-500">Senha alterada ✓</span>}
        </div>
      </form>
    </>
  );
}
