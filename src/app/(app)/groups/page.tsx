import Link from "next/link";
import { eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { groupMembers, groups, users, MAX_GROUPS } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { CreateGroupBox, JoinGroupBox } from "@/components/GroupForms";
import { AvatarStack } from "@/components/Avatar";
import { ChevronRight, PlusIcon } from "@/components/Icons";
import { FloatingAction } from "@/components/Nav";

export default async function GroupsPage({ searchParams }: { searchParams: { novo?: string } }) {
  const user = await requireUser();
  const mine = await db
    .select({ id: groups.id, name: groups.name, ownerId: groups.ownerId })
    .from(groupMembers)
    .innerJoin(groups, eq(groups.id, groupMembers.groupId))
    .where(eq(groupMembers.userId, user.id));

  const people = mine.length
    ? await db
        .select({ groupId: groupMembers.groupId, name: users.name, emoji: users.avatarEmoji })
        .from(groupMembers)
        .innerJoin(users, eq(users.id, groupMembers.userId))
        .where(inArray(groupMembers.groupId, mine.map((g) => g.id)))
        .orderBy(users.name)
    : [];
  const peopleOf = new Map<string, { name: string; emoji: string | null }[]>();
  for (const p of people) peopleOf.set(p.groupId, [...(peopleOf.get(p.groupId) ?? []), { name: p.name, emoji: p.emoji }]);

  const canAdd = mine.length < MAX_GROUPS;
  const showBoxes = mine.length === 0 || (canAdd && searchParams.novo === "1");

  return (
    <>
      <h1 className="page-title pt-2">Seus Grupos</h1>

      {mine.length > 0 && (
        <ul className="space-y-4">
          {mine.map((g) => {
            const names = peopleOf.get(g.id) ?? [];
            return (
              <li key={g.id}>
                <Link href={`/groups/${g.id}`} className="card block space-y-3 transition hover:shadow-md">
                  <div>
                    <p className="text-xl font-bold">{g.name}</p>
                    <p className="mt-0.5 text-sm text-ink-soft">{names.length} membro(s)</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <AvatarStack people={names} />
                    <ChevronRight className="h-5 w-5 text-ink-soft" />
                  </div>
                  {g.ownerId === user.id && (
                    <span className="inline-block rounded-md bg-sage-100 px-2.5 py-1 text-xs text-ink">Criador</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {mine.length >= MAX_GROUPS && (
        <p className="text-sm text-ink-soft">Você atingiu o limite de {MAX_GROUPS} grupos.</p>
      )}

      {showBoxes && (
        <div className="space-y-4">
          <CreateGroupBox />
          <JoinGroupBox />
        </div>
      )}

      {mine.length > 0 && canAdd && (
        <FloatingAction href={showBoxes ? "/groups" : "/groups?novo=1"}>
          {showBoxes ? "Fechar" : (<><PlusIcon className="h-5 w-5" /> Novo grupo</>)}
        </FloatingAction>
      )}
    </>
  );
}
