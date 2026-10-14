"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { ConfirmButton } from "./ConfirmButton";
import { SubmitButton } from "./SubmitButton";
import { drawSecretSantaAction, endSecretSantaAction } from "@/lib/actions/groups";

type Props = {
  groupId: string;
  isOwner: boolean;
  members: string[];
  /** Nome de quem o usuário logado tirou; null se o sorteio ainda não foi feito. */
  receiverName: string | null;
};

export function SecretSantaForm({ groupId, isOwner, members, receiverName }: Props) {
  const [open, setOpen] = useState(false);
  const [drawState, drawAction] = useFormState(drawSecretSantaAction.bind(null, groupId), undefined);
  const [endState, endAction] = useFormState(endSecretSantaAction.bind(null, groupId), undefined);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const drawn = receiverName !== null;
  const error = drawState?.error ?? endState?.error;
  const okMsg = drawn ? drawState?.ok : undefined;
  if (!drawn && !isOwner) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Amigo secreto"
        aria-label="Amigo secreto"
        className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-white text-xl shadow-sm transition hover:border-terracotta-200 hover:bg-terracotta-50 ${
          drawn ? "border-terracotta-200" : "border-cream-200"
        }`}
      >
        🎅
        {drawn && <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-terracotta-500 ring-2 ring-white" />}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div role="dialog" aria-modal="true" aria-labelledby="santa-title" className="card w-full max-w-md space-y-4 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <h2 id="santa-title" className="text-lg font-semibold">🎅 Amigo secreto</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Fechar" className="text-stone-400 hover:text-stone-700">
                ✕
              </button>
            </div>

            {drawn && (
              <div className="rounded-xl bg-terracotta-50 px-4 py-5 text-center">
                <p className="text-sm text-stone-600">Você deve presentear</p>
                <p className="mt-1 text-2xl font-semibold text-terracotta-700">{receiverName}</p>
                <p className="mt-2 text-xs text-stone-500">Guarde segredo! 🤫</p>
              </div>
            )}

            {isOwner && (
              <>
                {!drawn && (
                  <p className="text-sm text-stone-600">
                    Cada membro é sorteado para presentear uma pessoa do grupo. Depois do sorteio, todos veem quem tiraram.
                  </p>
                )}
                <div>
                  <p className="mb-1 text-sm font-medium">Participantes ({members.length})</p>
                  <ul className="flex flex-wrap gap-1.5">
                    {members.map((n, i) => (
                      <li key={i} className="rounded-full bg-sage-50 px-2.5 py-0.5 text-xs text-sage-700">{n}</li>
                    ))}
                  </ul>
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                {okMsg && <p className="text-sm text-sage-700">✓ {okMsg}</p>}
              </>
            )}

            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="btn-ghost">Fechar</button>
              {isOwner && (
                drawn ? (
                  <form action={endAction}>
                    <ConfirmButton
                      className="btn-danger"
                      message="Encerrar o sorteio? O resultado será apagado e o ícone 🎅 deixará de aparecer para os membros."
                    >
                      Encerrar sorteio
                    </ConfirmButton>
                  </form>
                ) : (
                  <form action={drawAction}>
                    <SubmitButton>Sortear</SubmitButton>
                  </form>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
