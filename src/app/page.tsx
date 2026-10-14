import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function Home() {
  if (await getCurrentUser()) redirect("/groups");
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="text-5xl">🎁</div>
      <h1 className="text-4xl font-semibold tracking-tight text-terracotta-600">Gifty</h1>
      <p className="text-stone-600">
        Listas de presentes para família e amigos — com reservas secretas, para manter a surpresa.
      </p>
      <div className="flex gap-3">
        <Link href="/register" className="btn">Criar conta</Link>
        <Link href="/login" className="btn-ghost">Entrar</Link>
      </div>
    </main>
  );
}
