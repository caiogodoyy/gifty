import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { groupMembers, groups, items, reservations, users } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { isAdminOver } from "@/lib/access";
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
      reservedBy: reservations.reservedBy,
      reserverName: users.name,
    })
    .from(items)
    .leftJoin(reservations, eq(reservations.itemId, items.id))
    .leftJoin(users, eq(users.id, reservations.reservedBy))
    .where(eq(items.userId, member.id))
    .orderBy(desc(items.createdAt));

  const admin = await isAdminOver(viewer.id, member.id);
  const sizes: [string, string | null][] = [
    ["Blusa / Camisa", member.shirtSize],
    ["Calça / Bermuda", member.pantsSize],
    ["Calçado", member.shoeSize],
  ];

  return (
    <>
      <div>
        <Link href={`/groups/${group.id}`} className="text-sm text-stone-500 hover:underline">← {group.name}</Link>
        <h1 className="mt-1 text-2xl font-semibold">{member.name}</h1>
      </div>

      <section className="card space-y-3">
        <div className="grid grid-cols-3 gap-3 text-center">
          {sizes.map(([label, value]) => (
            <div key={label} className="rounded-xl bg-sage-50 p-3">
              <p className="text-xs text-stone-500">{label}</p>
              <p className="mt-1 font-semibold">{value || "—"}</p>
            </div>
          ))}
        </div>
        {member.notes && <p className="whitespace-pre-line text-sm text-stone-600">{member.notes}</p>}
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">Lista de desejos</h2>
        {list.length === 0 ? (
          <p className="text-sm text-stone-500">{member.name} ainda não adicionou itens.</p>
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
