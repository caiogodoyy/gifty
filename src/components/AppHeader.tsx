import Link from "next/link";
import { Logo } from "./Logo";
import { Avatar } from "./Avatar";

export function AppHeader({ name, emoji }: { name: string; emoji: string | null }) {
  return (
    <header className="flex items-center justify-between pb-2 pt-4">
      <Link href="/groups" aria-label="Gifty"><Logo height={40} /></Link>
      <Link href="/profile" aria-label="Meu perfil"><Avatar name={name} emoji={emoji} size={40} /></Link>
    </header>
  );
}
