import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";

export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-4">
      <Link href="/" className="text-center text-2xl font-semibold tracking-tight text-terracotta-600">🎁 Gifty</Link>
      <AuthForm mode="register" />
    </main>
  );
}
