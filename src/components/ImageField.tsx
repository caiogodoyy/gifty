"use client";

import { useState } from "react";
import { ImageIcon } from "./Icons";

/** Imagem do desejo: somente a URL da imagem (nada é enviado nem armazenado). */
export function ImageField({ initial }: { initial?: string | null }) {
  const [value, setValue] = useState(initial?.startsWith("data:") ? "" : initial ?? "");
  const [broken, setBroken] = useState(false);
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-cream-100 text-ink-soft">
        {value && !broken ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" referrerPolicy="no-referrer" onError={() => setBroken(true)} className="h-full w-full object-cover" />
        ) : (
          <ImageIcon className="h-6 w-6" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <input
          className="input"
          name="image"
          placeholder="URL da imagem (opcional)"
          value={value}
          onChange={(e) => { setValue(e.target.value.trim()); setBroken(false); }}
          maxLength={500}
          inputMode="url"
        />
        {broken && <p className="mt-1 text-xs text-terracotta-700">Não foi possível carregar essa imagem.</p>}
      </div>
    </div>
  );
}
