"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GiftIcon, UserIcon, UsersIcon } from "./Icons";

const TABS = [
  { href: "/groups", label: "Grupos", Icon: UsersIcon },
  { href: "/wishlist", label: "Minha Lista", Icon: GiftIcon },
  { href: "/profile", label: "Perfil", Icon: UserIcon },
];

/** Barra de navegação inferior (estilo app mobile). */
export function BottomNav() {
  const path = usePathname();
  const isActive = (href: string) =>
    path === href || path.startsWith(href + "/") || (href === "/profile" && path.startsWith("/help"));
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-cream-200 bg-white/95 backdrop-blur">
      <ul className="mx-auto flex max-w-md">
        {TABS.map(({ href, label, Icon }) => {
          const on = isActive(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={on ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 py-2.5 text-xs ${on ? "text-terracotta-600" : "text-ink-soft"}`}
              >
                <Icon className="h-6 w-6" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Botão flutuante de ação (ex.: "+ Novo grupo"), acima da barra inferior. */
export function FloatingAction({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-10">
      <div className="mx-auto flex max-w-md justify-end px-4">
        <Link
          href={href}
          className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-terracotta-600 px-5 py-3 text-sm font-medium text-white shadow-lg transition hover:bg-terracotta-700"
        >
          {children}
        </Link>
      </div>
    </div>
  );
}
