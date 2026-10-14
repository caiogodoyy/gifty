"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { items, reservations } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { isAdminOver, sharesGroup } from "@/lib/access";

function parse(formData: FormData) {
  const get = (k: string, max: number) => String(formData.get(k) ?? "").trim().slice(0, max);
  const name = get("name", 120);
  const description = get("description", 500) || null;
  let url: string | null = get("url", 500) || null;
  if (url) {
    if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
    try {
      new URL(url);
    } catch {
      url = null;
    }
  }
  return { name, description, url };
}

export async function addItem(formData: FormData) {
  const user = await requireUser();
  const data = parse(formData);
  if (!data.name) return;
  await db.insert(items).values({ id: crypto.randomUUID(), userId: user.id, ...data });
  revalidatePath("/wishlist");
}

export async function updateItem(itemId: string, formData: FormData) {
  const user = await requireUser();
  const data = parse(formData);
  if (!data.name) return;
  await db.update(items).set(data).where(and(eq(items.id, itemId), eq(items.userId, user.id)));
  revalidatePath("/wishlist");
}

export async function deleteItem(itemId: string) {
  const user = await requireUser();
  await db.delete(reservations).where(eq(reservations.itemId, itemId)); // sem FK enforcement garantido
  await db.delete(items).where(and(eq(items.id, itemId), eq(items.userId, user.id)));
  revalidatePath("/wishlist");
}

export async function reserveItem(itemId: string) {
  const user = await requireUser();
  const [item] = await db.select().from(items).where(eq(items.id, itemId)).limit(1);
  if (!item || item.userId === user.id) return; // dono não reserva o próprio item
  if (!(await sharesGroup(user.id, item.userId))) return;
  await db.insert(reservations).values({ itemId, reservedBy: user.id }).onConflictDoNothing();
  revalidatePath(`/groups`, "layout");
}

export async function cancelReservation(itemId: string) {
  const user = await requireUser();
  const [row] = await db
    .select({ reservedBy: reservations.reservedBy, owner: items.userId })
    .from(reservations)
    .innerJoin(items, eq(items.id, reservations.itemId))
    .where(eq(reservations.itemId, itemId))
    .limit(1);
  if (!row) return;
  const allowed = row.reservedBy === user.id || (await isAdminOver(user.id, row.owner));
  if (!allowed) return;
  await db.delete(reservations).where(eq(reservations.itemId, itemId));
  revalidatePath(`/groups`, "layout");
}
