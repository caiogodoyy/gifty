"use client";

import { useFormState } from "react-dom";
import { SubmitButton } from "./SubmitButton";
import { updateProfile } from "@/lib/actions/profile";

type P = { shirtSize: string | null; pantsSize: string | null; shoeSize: string | null; notes: string | null };

export function ProfileForm({ profile }: { profile: P }) {
  const [state, action] = useFormState(updateProfile, undefined);
  const saved = state !== undefined;
  return (
    <form action={action} className="card space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="space-y-1 text-sm">
          <span className="text-ink-soft">Blusa / Camisa</span>
          <input className="input" name="shirtSize" defaultValue={profile.shirtSize ?? ""} placeholder="P, M, G, GG…" />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-ink-soft">Calça / Bermuda</span>
          <input className="input" name="pantsSize" defaultValue={profile.pantsSize ?? ""} placeholder="38, 40, 42…" />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-ink-soft">Calçado</span>
          <input className="input" name="shoeSize" defaultValue={profile.shoeSize ?? ""} placeholder="35, 38, 41…" />
        </label>
      </div>
      <label className="block space-y-1 text-sm">
        <span className="text-ink-soft">Observações</span>
        <textarea
          className="input min-h-24"
          name="notes"
          defaultValue={profile.notes ?? ""}
          maxLength={500}
          placeholder="Ex: Preferência por cores neutras, alergia a bijuterias"
        />
      </label>
      <div className="flex items-center gap-3">
        <SubmitButton>Salvar</SubmitButton>
        {saved && <span className="text-sm text-ink-soft">Salvo ✓</span>}
      </div>
    </form>
  );
}
