import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { COOKIE_NAME, SESSION_SECONDS, signToken, verifyToken } from "./jwt";

export async function createSession(userId: string) {
  cookies().set(COOKIE_NAME, await signToken(userId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export function destroySession() {
  cookies().delete(COOKIE_NAME);
}

export const getCurrentUser = cache(async () => {
  const userId = await verifyToken(cookies().get(COOKIE_NAME)?.value);
  if (!userId) return null;
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return user ?? null;
});

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}
