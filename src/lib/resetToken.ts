import { createHash, randomBytes } from "node:crypto";

/** Token de redefinição de senha: o valor bruto vai por e-mail, só o hash fica no banco. */
export const newResetToken = () => randomBytes(32).toString("base64url");
export const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");
