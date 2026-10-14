// Recorta as margens do logo.jpeg (1024x1024; conteúdo ≈ 675x805 a partir de 175,110).
export function Logo({ height = 56, className = "" }: { height?: number; className?: string }) {
  const s = height / 805;
  return (
    <span
      role="img"
      aria-label="Gifty"
      className={`inline-block mix-blend-multiply ${className}`}
      style={{
        width: 675 * s,
        height,
        backgroundImage: "url(/logo.jpeg)",
        backgroundSize: `${1024 * s}px ${1024 * s}px`,
        backgroundPosition: `${-175 * s}px ${-110 * s}px`,
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}
