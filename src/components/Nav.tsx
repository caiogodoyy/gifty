import Link from "next/link";
import { logout } from "@/lib/actions/auth";

export function Nav({ name }: { name: string }) {
  const link = "rounded-lg px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-100";
  return (
    <header className="sticky top-0 z-10 border-b border-stone-200 bg-stone-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-4 py-3">
        <Link href="/groups" className="text-lg font-semibold tracking-tight">🎁 Gifty</Link>
        <nav className="flex items-center gap-1">
          <Link href="/groups" className={link}>Grupos</Link>
          <Link href="/wishlist" className={link}>Minha lista</Link>
          <Link href="/profile" className={link} title={name}>Perfil</Link>
          <form action={logout}>
            <button className={link}>Sair</button>
          </form>
        </nav>
      </div>
    </header>
  );
}
