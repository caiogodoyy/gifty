"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { users } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { EMAIL_RE, passwordValid } from "@/lib/validation";
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

const text = (f: FormData, k: string) => {
  const v = f.get(k);
  return typeof v === "string" ? v : "";
};

export async function updateAccount(_: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const name = text(formData, "name").trim();
  const email = text(formData, "email").trim().toLowerCase();
  const currentPassword = text(formData, "currentPassword");

  if (name.length < 2) return { error: "Informe seu nome." };
  if (!EMAIL_RE.test(email)) return { error: "E-mail inválido." };

  if (email !== user.email) {
    if (!(await bcrypt.compare(currentPassword, user.passwordHash)))
      return { error: "Para alterar o e-mail, informe sua senha atual corretamente." };
    const [taken] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
    if (taken) return { error: "Este e-mail já está cadastrado." };
  }

  await db.update(users).set({ name, email }).where(eq(users.id, user.id));
  revalidatePath("/", "layout");
  return { error: undefined };
}

export async function changePassword(_: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const currentPassword = text(formData, "currentPassword");
  const newPassword = text(formData, "newPassword");

  if (!(await bcrypt.compare(currentPassword, user.passwordHash))) return { error: "Senha atual incorreta." };
  if (!passwordValid(newPassword))
    return { error: "A nova senha precisa ter 8+ caracteres, letras, números e uma letra maiúscula." };

  await db.update(users).set({ passwordHash: await bcrypt.hash(newPassword, 10) }).where(eq(users.id, user.id));
  return { error: undefined };
}
