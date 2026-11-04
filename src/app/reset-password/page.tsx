import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";

export default function Page({ searchParams }: { searchParams: { token?: string } }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-4">
      <Link href="/" aria-label="Gifty" className="mx-auto"><Logo height={96} /></Link>
      {searchParams.token ? (
        <ResetPasswordForm token={searchParams.token} />
      ) : (
        <p className="card text-center text-sm">
          Link inválido. <Link href="/forgot-password" className="underline">Pedir novo link</Link>
        </p>
      )}
    </main>
  );
}
