import "server-only";
import nodemailer from "nodemailer";

// Envio via SMTP (ex.: Gmail com senha de app). Sem SMTP_HOST em desenvolvimento,
// o e-mail é apenas impresso no console.
export async function sendMail({ to, subject, html, text }: { to: string; subject: string; html: string; text: string }) {
  const host = process.env.SMTP_HOST;
  if (!host) {
    if (process.env.NODE_ENV === "production") throw new Error("SMTP_HOST não configurado.");
    console.log(`\n[mail] Para: ${to}\n[mail] Assunto: ${subject}\n${text}\n`);
    return;
  }
  const port = Number(process.env.SMTP_PORT ?? 465);
  const transport = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  await transport.sendMail({ from: process.env.EMAIL_FROM ?? process.env.SMTP_USER, to, subject, html, text });
}

export const appUrl = () => (process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
