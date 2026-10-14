import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { groupMembers, groups, users } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { deleteGroup, leaveGroup, regenerateCode, removeMember } from "@/lib/actions/groups";
import { ConfirmButton } from "@/components/ConfirmButton";

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
    .select({ id: users.id, name: users.name })
    .from(groupMembers)
    .innerJoin(users, eq(users.id, groupMembers.userId))
    .where(eq(groupMembers.groupId, group.id))
    .orderBy(users.name);

  const isOwner = group.ownerId === user.id;

  return (
    <>
      <div>
        <Link href="/groups" className="text-sm text-stone-500 hover:underline">← Grupos</Link>
        <h1 className="mt-1 text-2xl font-semibold">{group.name}</h1>
      </div>

      {isOwner && (
        <section className="card space-y-3">
          <h2 className="font-semibold">Código de convite</h2>
          <p className="select-all rounded-xl bg-stone-100 px-4 py-3 text-center font-mono text-xl tracking-widest">
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
        <h2 className="font-semibold">Membros ({members.length})</h2>
        <ul className="space-y-2">
          {members.map((m) => (
            <li key={m.id} className="card flex items-center justify-between gap-3 !p-3">
              {m.id === user.id ? (
                <Link href="/wishlist" className="font-medium hover:underline">{m.name} <span className="text-stone-400">(você)</span></Link>
              ) : (
                <Link href={`/groups/${group.id}/members/${m.id}`} className="font-medium hover:underline">
                  {m.name}
                </Link>
              )}
              <div className="flex items-center gap-2">
                {m.id === group.ownerId && <span className="text-xs text-stone-500">criador</span>}
                {isOwner && m.id !== user.id && (
                  <form action={removeMember.bind(null, group.id, m.id)}>
                    <ConfirmButton message={`Remover ${m.name} do grupo?`}>Remover</ConfirmButton>
                  </form>
                )}
              </div>
            </li>
          ))}
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
