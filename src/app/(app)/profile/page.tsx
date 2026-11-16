import Link from "next/link";
import { AccountForms } from "@/components/AccountForms";
import { ProfileForm } from "@/components/ProfileForm";
import { ConfirmButton } from "@/components/ConfirmButton";
import { EmojiPicker } from "@/components/EmojiPicker";
import { Avatar } from "@/components/Avatar";
import { ChevronRight, HelpIcon, RulerIcon } from "@/components/Icons";
import { requireUser } from "@/lib/auth";
import { logout } from "@/lib/actions/auth";

function Row({ href, icon, title, sub }: { href: string; icon: React.ReactNode; title: string; sub: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 border-b border-cream-200 py-3 last:border-0">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sage-100 text-ink">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block font-bold">{title}</span>
        <span className="block truncate text-sm text-ink-soft">{sub}</span>
      </span>
      <ChevronRight className="h-5 w-5 text-ink-soft" />
    </Link>
  );
}

export default async function ProfilePage({ searchParams }: { searchParams: { secao?: string } }) {
  const user = await requireUser();
  const secao = searchParams.secao;
  return (
    <>
      <h1 className="page-title pt-2 text-center">Meu Perfil</h1>
      <section className="flex flex-col items-center gap-1 text-center">
        <Avatar name={user.name} emoji={user.avatarEmoji} size={88} />
        <p className="mt-2 text-xl font-bold">{user.name}</p>
        <p className="text-sm text-ink-soft">{user.email}</p>
        <Link href={secao === "conta" ? "/profile" : "/profile?secao=conta"} className="btn-outline mt-2">
          {secao === "conta" ? "Fechar" : "Editar Perfil"}
        </Link>
      </section>

      {secao === "conta" && <EmojiPicker current={user.avatarEmoji} />}

      {secao === "conta" && <AccountForms key={`${user.name}|${user.email}`} name={user.name} email={user.email} />}

      {secao === "medidas" ? (
        <section className="space-y-3">
          <h2 className="text-lg font-bold">Minhas Medidas & Tamanhos</h2>
          <p className="text-sm text-ink-soft">Seus tamanhos ficam visíveis para quem está nos seus grupos.</p>
          <ProfileForm profile={user} />
          <Link href="/profile" className="text-sm text-ink-soft underline">Fechar</Link>
        </section>
      ) : (
        <nav>
          <Row
            href="/profile?secao=medidas"
            icon={<RulerIcon className="h-5 w-5" />}
            title="Minhas Medidas & Tamanhos"
            sub="Camiseta, Calça, Calçado..."
          />
          <Row href="/help" icon={<HelpIcon className="h-5 w-5" />} title="Ajuda & Suporte" sub="Como usar e por que usar o Gifty" />
        </nav>
      )}

      <form action={logout} className="text-center">
        <ConfirmButton message="Deseja sair da sua conta?" className="text-sm text-terracotta-600 hover:underline">
          Sair da conta
        </ConfirmButton>
      </form>
    </>
  );
}
