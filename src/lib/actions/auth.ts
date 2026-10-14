"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, destroySession } from "@/lib/auth";

export type FormState = { error?: string } | undefined;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const str = (v: FormDataEntryValue | null) => (typeof v === "string" ? v.trim() : "");

export async function register(_: FormState, formData: FormData): Promise<FormState> {
  const name = str(formData.get("name"));
  const email = str(formData.get("email")).toLowerCase();
  const password = typeof formData.get("password") === "string" ? (formData.get("password") as string) : "";

  if (name.length < 2) return { error: "Informe seu nome." };
  if (!EMAIL_RE.test(email)) return { error: "E-mail inválido." };
  if (password.length < 8) return { error: "A senha precisa ter ao menos 8 caracteres." };

  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing) return { error: "Este e-mail já está cadastrado." };

  const id = crypto.randomUUID();
  await db.insert(users).values({ id, name, email, passwordHash: await bcrypt.hash(password, 10) });
  await createSession(id);
  redirect("/groups");
}

export async function login(_: FormState, formData: FormData): Promise<FormState> {
  const email = str(formData.get("email")).toLowerCase();
  const password = typeof formData.get("password") === "string" ? (formData.get("password") as string) : "";

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  // compara sempre, para não vazar a existência do e-mail pelo tempo de resposta
  const hash = user?.passwordHash ?? "$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidi";
  const ok = await bcrypt.compare(password, hash);
  if (!user || !ok) return { error: "E-mail ou senha incorretos." };

  await createSession(user.id);
  redirect("/groups");
}

export async function logout() {
  destroySession();
  redirect("/login");
}
