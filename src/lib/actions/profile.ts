"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { users } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import type { FormState } from "./auth";

const field = (f: FormData, k: string, max: number) => {
  const v = f.get(k);
  return typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null;
};

export async function updateProfile(_: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  await db
    .update(users)
    .set({
      shirtSize: field(formData, "shirtSize", 10),
      pantsSize: field(formData, "pantsSize", 10),
      shoeSize: field(formData, "shoeSize", 10),
      notes: field(formData, "notes", 500),
    })
    .where(eq(users.id, user.id));
  revalidatePath("/profile");
  return { error: undefined };
}
