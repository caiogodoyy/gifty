import Link from "next/link";
import { logout } from "@/lib/actions/auth";
import { Logo } from "./Logo";
import { ConfirmButton } from "./ConfirmButton";

export function Nav({ name }: { name: string }) {
  const link = "rounded-lg px-3 py-1.5 text-sm text-stone-600 transition hover:bg-sage-100 hover:text-sage-700";
  return (
    <header className="sticky top-0 z-10 border-b border-cream-200 bg-cream-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-4 py-3">
        <Link href="/groups" aria-label="Gifty"><Logo height={52} /></Link>
        <nav className="flex items-center gap-1">
          <Link href="/groups" className={link}>Grupos</Link>
          <Link href="/wishlist" className={link}>Minha lista</Link>
          <Link href="/profile" className={link} title={name}>Perfil</Link>
          <form action={logout} className="ml-2">
            <ConfirmButton message="Deseja sair da sua conta?" className="btn-terracotta">
              Sair
            </ConfirmButton>
          </form>
        </nav>
      </div>
    </header>
  );
}
