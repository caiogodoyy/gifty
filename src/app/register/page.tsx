import Link from "next/link";
import { Logo } from "@/components/Logo";
import { AuthForm } from "@/components/AuthForm";

export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-4">
      <Link href="/" aria-label="Gifty" className="mx-auto"><Logo height={96} /></Link>
      <AuthForm mode="register" />
    </main>
  );
}
