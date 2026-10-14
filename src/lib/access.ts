import "server-only";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { groupMembers, groups } from "@/db/schema";

export async function groupIdsOf(userId: string) {
  const rows = await db.select({ id: groupMembers.groupId }).from(groupMembers).where(eq(groupMembers.userId, userId));
  return rows.map((r) => r.id);
}

/** Grupos em comum entre dois usuários. */
export async function sharedGroupIds(a: string, b: string) {
  const mine = await groupIdsOf(a);
  if (mine.length === 0) return [];
  const rows = await db
    .select({ id: groupMembers.groupId })
    .from(groupMembers)
    .where(and(eq(groupMembers.userId, b), inArray(groupMembers.groupId, mine)));
  return rows.map((r) => r.id);
}

export async function sharesGroup(a: string, b: string) {
  return (await sharedGroupIds(a, b)).length > 0;
}

/** `admin` é criador de algum grupo que contém também `target`. */
export async function isAdminOver(admin: string, target: string) {
  const shared = await sharedGroupIds(admin, target);
  if (shared.length === 0) return false;
  const rows = await db
    .select({ id: groups.id })
    .from(groups)
    .where(and(inArray(groups.id, shared), eq(groups.ownerId, admin)))
    .limit(1);
  return rows.length > 0;
}
