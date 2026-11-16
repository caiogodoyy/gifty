import Link from "next/link";
import { ChevronLeft } from "./Icons";

export function PageBack({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-ink">
      <ChevronLeft className="h-4 w-4" /> {label}
    </Link>
  );
}
