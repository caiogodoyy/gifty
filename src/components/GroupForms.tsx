"use client";

import { useFormState } from "react-dom";
import { SubmitButton } from "./SubmitButton";
import { createGroup, joinGroup } from "@/lib/actions/groups";

export function CreateGroupBox() {
  const [state, action] = useFormState(createGroup, undefined);
  return (
    <form action={action} className="card space-y-3">
      <div>
        <h3 className="font-semibold">Criar grupo</h3>
        <p className="text-sm text-stone-500">Você recebe um código para convidar os outros.</p>
      </div>
      <input className="input" name="name" placeholder="Ex: Natal Família Silva" maxLength={60} required />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <SubmitButton>Criar grupo</SubmitButton>
    </form>
  );
}

export function JoinGroupBox() {
  const [state, action] = useFormState(joinGroup, undefined);
  return (
    <form action={action} className="card space-y-3">
      <div>
        <h3 className="font-semibold">Entrar em um grupo</h3>
        <p className="text-sm text-stone-500">Cole o código de convite que você recebeu.</p>
      </div>
      <input className="input uppercase" name="code" placeholder="SILVA-8821" required />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <SubmitButton>Entrar</SubmitButton>
    </form>
  );
}
