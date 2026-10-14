"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { groupMembers, groups, MAX_GROUPS } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { groupIdsOf } from "@/lib/access";
import type { FormState } from "./auth";

const LIMIT_ERROR = `Você já participa de ${MAX_GROUPS} grupos. Saia de um para entrar em outro.`;

function makeCode(name: string) {
  const prefix =
    name
      .normalize("NFD")
      .replace(/[^\p{L}\s]/gu, "")
      .replace(/\p{M}/gu, "")
      .toUpperCase()
      .split(/\s+/)
      .filter((w) => w.length > 2)
      .pop()
      ?.slice(0, 8) || "GIFTY";
  return `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
}

async function uniqueCode(name: string) {
  for (let i = 0; i < 10; i++) {
    const code = makeCode(name);
    const [hit] = await db.select({ id: groups.id }).from(groups).where(eq(groups.inviteCode, code)).limit(1);
    if (!hit) return code;
  }
  return `GIFTY-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
}

async function requireOwner(groupId: string) {
  const user = await requireUser();
  const [group] = await db.select().from(groups).where(eq(groups.id, groupId)).limit(1);
  if (!group || group.ownerId !== user.id) throw new Error("Apenas o criador do grupo pode fazer isso.");
  return { user, group };
}

export async function createGroup(_: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const name = String(formData.get("name") ?? "").trim().slice(0, 60);
  if (name.length < 2) return { error: "Dê um nome ao grupo." };
  if ((await groupIdsOf(user.id)).length >= MAX_GROUPS) return { error: LIMIT_ERROR };

  const id = crypto.randomUUID();
  await db.batch([
    db.insert(groups).values({ id, name, inviteCode: await uniqueCode(name), ownerId: user.id }),
    db.insert(groupMembers).values({ groupId: id, userId: user.id }),
  ]);
  revalidatePath("/groups");
  redirect(`/groups/${id}`);
}

export async function joinGroup(_: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  if (!code) return { error: "Informe o código de convite." };

  const mine = await groupIdsOf(user.id);
  if (mine.length >= MAX_GROUPS) return { error: LIMIT_ERROR };

  const [group] = await db.select().from(groups).where(eq(groups.inviteCode, code)).limit(1);
  if (!group) return { error: "Código inválido ou expirado." };
  if (mine.includes(group.id)) redirect(`/groups/${group.id}`);

  await db.insert(groupMembers).values({ groupId: group.id, userId: user.id });
  revalidatePath("/groups");
  redirect(`/groups/${group.id}`);
}

export async function regenerateCode(groupId: string) {
  const { group } = await requireOwner(groupId);
  await db.update(groups).set({ inviteCode: await uniqueCode(group.name) }).where(eq(groups.id, groupId));
  revalidatePath(`/groups/${groupId}`);
}

export async function removeMember(groupId: string, userId: string) {
  const { user } = await requireOwner(groupId);
  if (userId === user.id) throw new Error("O criador não pode se remover; delete o grupo.");
  await db.delete(groupMembers).where(and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, userId)));
  revalidatePath(`/groups/${groupId}`);
}

export async function deleteGroup(groupId: string) {
  await requireOwner(groupId);
  await db.batch([
    db.delete(groupMembers).where(eq(groupMembers.groupId, groupId)),
    db.delete(groups).where(eq(groups.id, groupId)),
  ]);
  revalidatePath("/groups");
  redirect("/groups");
}

export async function leaveGroup(groupId: string) {
  const user = await requireUser();
  const [group] = await db.select().from(groups).where(eq(groups.id, groupId)).limit(1);
  if (!group) redirect("/groups");
  if (group.ownerId === user.id) throw new Error("O criador não pode sair; delete o grupo.");
  await db.delete(groupMembers).where(and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, user.id)));
  revalidatePath("/groups");
  redirect("/groups");
}
