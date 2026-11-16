const COLORS = ["bg-terracotta-600", "bg-sage-600", "bg-[#5c6b73]", "bg-[#8a6a5c]", "bg-[#b08a4a]"];

function pick(name: string) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return COLORS[h % COLORS.length];
}

export function Avatar({ name, emoji, size = 40, className = "" }: { name: string; emoji?: string | null; size?: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 select-none items-center justify-center rounded-full font-medium text-white ${pick(name)} ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {emoji || name.trim().charAt(0).toUpperCase() || "?"}
    </span>
  );
}

/** Pilha de avatares sobrepostos, com "+N" quando passa do limite. */
export function AvatarStack({ people, max = 4, size = 36 }: { people: { name: string; emoji: string | null }[]; max?: number; size?: number }) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  return (
    <div className="flex items-center">
      {shown.map((n, i) => (
        <Avatar key={i} name={n.name} emoji={n.emoji} size={size} className={`ring-2 ring-white ${i > 0 ? "-ml-2" : ""}`} />
      ))}
      {extra > 0 && (
        <span
          className="-ml-2 inline-flex items-center justify-center rounded-full bg-cream-100 text-xs font-medium text-ink ring-2 ring-white"
          style={{ width: size, height: size }}
        >
          +{extra}
        </span>
      )}
    </div>
  );
}
