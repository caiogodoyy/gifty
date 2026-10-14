"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ children, className = "btn", disabled = false }: { children: React.ReactNode; className?: string; disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending || disabled} className={className}>
      {pending ? "Aguarde…" : children}
    </button>
  );
}
