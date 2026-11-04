import { describe, expect, it } from "vitest";
import { hashToken, newResetToken } from "./resetToken";

describe("token de redefinição", () => {
  it("é único e o hash não revela o token", () => {
    const t = newResetToken();
    expect(t).not.toBe(newResetToken());
    expect(hashToken(t)).not.toContain(t);
    expect(hashToken(t)).toBe(hashToken(t));
  });
});
