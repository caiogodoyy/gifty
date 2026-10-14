export default function Loading() {
  return (
    <div className="space-y-4 animate-pulse" aria-busy="true" aria-label="Carregando">
      <div className="h-8 w-48 rounded-lg bg-cream-200" />
      <div className="h-24 rounded-2xl bg-cream-100" />
      <div className="h-24 rounded-2xl bg-cream-100" />
    </div>
  );
}
