import { notFound, redirect } from "next/navigation";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { groupMembers, groups, items, reservations, users } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { isAdminOver } from "@/lib/access";
import { Avatar } from "@/components/Avatar";
import { PageBack } from "@/components/PageBack";
import { SizeChips } from "@/components/SizeChips";
import { GiftIcon } from "@/components/Icons";
import { MemberItem } from "@/components/MemberItem";

export default async function MemberPage({ params }: { params: { id: string; userId: string } }) {
  const viewer = await requireUser();
  if (params.userId === viewer.id) redirect("/wishlist"); // dono nunca vê reservas

  // visitante e alvo precisam ser membros do grupo da URL
  const rows = await db
    .select({ userId: groupMembers.userId })
    .from(groupMembers)
    .where(eq(groupMembers.groupId, params.id));
  const ids = new Set(rows.map((r) => r.userId));
  if (!ids.has(viewer.id) || !ids.has(params.userId)) notFound();

  const [member] = await db.select().from(users).where(eq(users.id, params.userId)).limit(1);
  const [group] = await db.select().from(groups).where(eq(groups.id, params.id)).limit(1);
  if (!member || !group) notFound();

  const list = await db
    .select({
      id: items.id,
      name: items.name,
      description: items.description,
      url: items.url,
      imageUrl: items.imageUrl,
      reservedBy: reservations.reservedBy,
      reserverName: users.name,
    })
    .from(items)
    .leftJoin(reservations, eq(reservations.itemId, items.id))
    .leftJoin(users, eq(users.id, reservations.reservedBy))
    .where(eq(items.userId, member.id))
    .orderBy(desc(items.createdAt));

  const first = member.name.split(" ")[0];
  const admin = await isAdminOver(viewer.id, member.id);

  return (
    <>
      <PageBack href={`/groups/${group.id}`} label={group.name} />

      <section className="flex items-center gap-4">
        <Avatar name={member.name} emoji={member.avatarEmoji} size={72} />
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold">{member.name}</h1>
          <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-ink-soft">
            <GiftIcon className="h-4 w-4" /> {list.length} {list.length === 1 ? "desejo" : "desejos"}
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">Medidas de {first}</h2>
        <SizeChips shirt={member.shirtSize} pants={member.pantsSize} shoe={member.shoeSize} />
        {!member.shirtSize && !member.pantsSize && !member.shoeSize && (
          <p className="text-sm text-ink-soft">Nenhuma medida informada.</p>
        )}
        {member.notes && <p className="whitespace-pre-line text-sm text-ink-soft">{member.notes}</p>}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">Desejos de {first}</h2>
        {list.length === 0 ? (
          <p className="text-sm text-ink-soft">{member.name} ainda não adicionou itens.</p>
        ) : (
          <ul className="space-y-3">
            {list.map((i) => (
              <MemberItem
                key={i.id}
                item={i}
                reservedByName={i.reservedBy ? i.reserverName ?? "alguém" : null}
                reservedByMe={i.reservedBy === viewer.id}
                canCancel={i.reservedBy === viewer.id || admin}
              />
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
