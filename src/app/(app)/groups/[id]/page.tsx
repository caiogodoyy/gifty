import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { groupMembers, groups, secretSanta, users } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { deleteGroup, leaveGroup, regenerateCode, removeMember } from "@/lib/actions/groups";
import { SecretSantaForm } from "@/components/SecretSantaForm";
import { ConfirmButton } from "@/components/ConfirmButton";
import { Avatar } from "@/components/Avatar";
import { PageBack } from "@/components/PageBack";
import { ChevronRight } from "@/components/Icons";

export default async function GroupPage({ params }: { params: { id: string } }) {
  const user = await requireUser();
  const [membership] = await db
    .select()
    .from(groupMembers)
    .where(and(eq(groupMembers.groupId, params.id), eq(groupMembers.userId, user.id)))
    .limit(1);
  if (!membership) notFound();

  const [group] = await db.select().from(groups).where(eq(groups.id, params.id)).limit(1);
  if (!group) notFound();

  const members = await db
    .select({ id: users.id, name: users.name, emoji: users.avatarEmoji })
    .from(groupMembers)
    .innerJoin(users, eq(users.id, groupMembers.userId))
    .where(eq(groupMembers.groupId, group.id))
    .orderBy(users.name);

  const isOwner = group.ownerId === user.id;

  // só a linha do próprio usuário é consultada: ninguém vê o sorteio dos outros
  const [mine] = await db
    .select({ name: users.name })
    .from(secretSanta)
    .innerJoin(users, eq(users.id, secretSanta.receiverId))
    .where(and(eq(secretSanta.groupId, group.id), eq(secretSanta.giverId, user.id)))
    .limit(1);

  return (
    <>
      <div>
        <PageBack href="/groups" label="Grupos" />
        <div className="mt-1 flex items-center justify-between gap-3">
          <h1 className="page-title">{group.name}</h1>
          <SecretSantaForm
            groupId={group.id}
            isOwner={isOwner}
            members={members.map((m) => m.name)}
            receiverName={mine?.name ?? null}
          />
        </div>
      </div>

      {isOwner && (
        <section className="card space-y-3">
          <h2 className="font-semibold">Código de convite</h2>
          <p className="select-all rounded-xl bg-sage-100 px-4 py-3 text-center font-mono text-xl tracking-widest">
            {group.inviteCode}
          </p>
          <form action={regenerateCode.bind(null, group.id)}>
            <ConfirmButton message="Regerar o código invalida o antigo. Continuar?" className="btn-ghost">
              Regerar código
            </ConfirmButton>
          </form>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-bold">Membros ({members.length})</h2>
        <p className="text-sm text-ink-soft">Clique em um membro para ver a lista de desejos.</p>
        <ul className="space-y-2">
          {members.map((m) => {
            const me = m.id === user.id;
            return (
              <li key={m.id} className="card flex items-center gap-2 !p-0 transition hover:shadow-md">
                <Link
                  href={me ? "/wishlist" : `/groups/${group.id}/members/${m.id}`}
                  className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl p-3"
                >
                  <Avatar name={m.name} emoji={m.emoji} size={36} />
                  <span className="min-w-0 flex-1 truncate font-medium">
                    {m.name}
                    {me && <span className="text-ink-soft"> (você)</span>}
                    {m.id === group.ownerId && <span className="ml-2 text-xs font-normal text-ink-soft">criador</span>}
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-ink-soft" />
                </Link>
                {isOwner && !me && (
                  <form action={removeMember.bind(null, group.id, m.id)} className="pr-3">
                    <ConfirmButton message={`Remover ${m.name} do grupo?`}>Remover</ConfirmButton>
                  </form>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="pt-4">
        {isOwner ? (
          <form action={deleteGroup.bind(null, group.id)}>
            <ConfirmButton message="Deletar o grupo para todos os membros? Isso não pode ser desfeito.">
              Deletar grupo
            </ConfirmButton>
          </form>
        ) : (
          <form action={leaveGroup.bind(null, group.id)}>
            <ConfirmButton message="Sair deste grupo?">Sair do grupo</ConfirmButton>
          </form>
        )}
      </section>
    </>
  );
}
