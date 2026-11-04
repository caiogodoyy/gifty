"use server";

import bcrypt from "bcryptjs";
import { and, eq, gt } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { passwordResets, users } from "@/db/schema";
import { EMAIL_RE, passwordValid } from "@/lib/validation";
import { createSession, destroySession } from "@/lib/auth";
import { hashToken, newResetToken } from "@/lib/resetToken";
import { appUrl, sendMail } from "@/lib/mail";

const RESET_MINUTES = 60;

export type FormState = { error?: string } | undefined;

const str = (v: FormDataEntryValue | null) => (typeof v === "string" ? v.trim() : "");

export async function register(_: FormState, formData: FormData): Promise<FormState> {
  const name = str(formData.get("name"));
  const email = str(formData.get("email")).toLowerCase();
  const password = typeof formData.get("password") === "string" ? (formData.get("password") as string) : "";

  if (name.length < 2) return { error: "Informe seu nome." };
  if (!EMAIL_RE.test(email)) return { error: "E-mail inválido." };
  if (!passwordValid(password)) return { error: "A senha precisa ter 8+ caracteres, letras, números e uma letra maiúscula." };

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

export async function forgotPassword(_: (FormState & { ok?: string }) | undefined, formData: FormData): Promise<FormState & { ok?: string }> {
  const email = str(formData.get("email")).toLowerCase();
  if (!EMAIL_RE.test(email)) return { error: "E-mail inválido." };

  const [user] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (user) {
    const token = newResetToken();
    await db.batch([
      db.delete(passwordResets).where(eq(passwordResets.userId, user.id)), // só o link mais recente vale
      db.insert(passwordResets).values({
        tokenHash: hashToken(token),
        userId: user.id,
        expiresAt: new Date(Date.now() + RESET_MINUTES * 60_000),
      }),
    ]);
    const link = `${appUrl()}/reset-password?token=${token}`;
    await sendMail({
      to: email,
      subject: "Gifty: redefinição de senha",
      text: `Para criar uma nova senha, acesse o link (válido por ${RESET_MINUTES} minutos):\n${link}\n\nSe você não pediu isso, ignore este e-mail.`,
      html: `<p>Para criar uma nova senha, <a href="${link}">clique aqui</a> (válido por ${RESET_MINUTES} minutos).</p><p>Se você não pediu isso, ignore este e-mail.</p>`,
    });
  }
  // mesma resposta exista o e-mail ou não, para não revelar quem tem conta
  return { ok: "Se esse e-mail estiver cadastrado, enviamos um link para redefinir a senha." };
}

export async function resetPassword(_: FormState, formData: FormData): Promise<FormState> {
  const token = str(formData.get("token"));
  const password = typeof formData.get("password") === "string" ? (formData.get("password") as string) : "";
  if (!passwordValid(password)) return { error: "A senha precisa ter 8+ caracteres, letras, números e uma letra maiúscula." };

  const tokenHash = hashToken(token);
  const [reset] = await db
    .select()
    .from(passwordResets)
    .where(and(eq(passwordResets.tokenHash, tokenHash), gt(passwordResets.expiresAt, new Date())))
    .limit(1);
  if (!reset) return { error: "Link inválido ou expirado. Peça um novo." };

  await db.batch([
    db.update(users).set({ passwordHash: await bcrypt.hash(password, 10) }).where(eq(users.id, reset.userId)),
    db.delete(passwordResets).where(eq(passwordResets.userId, reset.userId)),
  ]);
  redirect("/login?reset=1");
}
