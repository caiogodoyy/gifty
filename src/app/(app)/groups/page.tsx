import Link from "next/link";
import { eq, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { groupMembers, groups, MAX_GROUPS } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { CreateGroupBox, JoinGroupBox } from "@/components/GroupForms";

export default async function GroupsPage({ searchParams }: { searchParams: { novo?: string } }) {
  const user = await requireUser();
  const mine = await db
    .select({ id: groups.id, name: groups.name, ownerId: groups.ownerId })
    .from(groupMembers)
    .innerJoin(groups, eq(groups.id, groupMembers.groupId))
    .where(eq(groupMembers.userId, user.id));

  const counts = mine.length
    ? await db
        .select({ groupId: groupMembers.groupId, n: sql<number>`count(*)` })
        .from(groupMembers)
        .where(inArray(groupMembers.groupId, mine.map((g) => g.id)))
        .groupBy(groupMembers.groupId)
    : [];
  const countOf = new Map(counts.map((c) => [c.groupId, Number(c.n)]));

  const canAdd = mine.length < MAX_GROUPS;
  const showBoxes = mine.length === 0 || (canAdd && searchParams.novo === "1");

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Grupos</h1>
        {mine.length > 0 && canAdd && (
          <Link
            href={showBoxes ? "/groups" : "/groups?novo=1"}
            aria-label="Criar ou entrar em um grupo"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-terracotta-600 text-2xl leading-none text-white hover:bg-terracotta-700"
          >
            {showBoxes ? "×" : "+"}
          </Link>
        )}
      </div>

      {mine.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2">
          {mine.map((g) => (
            <li key={g.id}>
              <Link href={`/groups/${g.id}`} className="card block transition hover:border-sage-300 hover:bg-sage-50">
                <p className="font-semibold">{g.name}</p>
                <p className="mt-1 text-sm text-stone-500">
                  {countOf.get(g.id) ?? 1} membro(s){g.ownerId === user.id ? " · você é o criador" : ""}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {mine.length >= MAX_GROUPS && (
        <p className="text-sm text-stone-500">Você atingiu o limite de {MAX_GROUPS} grupos.</p>
      )}

      {showBoxes && (
        <div className="grid gap-3 sm:grid-cols-2">
          <CreateGroupBox />
          <JoinGroupBox />
        </div>
      )}
    </>
  );
}
