export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const PASSWORD_RULES = [
  { id: "len", label: "Mínimo de 8 caracteres", test: (p: string) => p.length >= 8 },
  { id: "letter", label: "Contém letras", test: (p: string) => /\p{L}/u.test(p) },
  { id: "digit", label: "Contém números", test: (p: string) => /\d/.test(p) },
  { id: "upper", label: "Contém letra maiúscula", test: (p: string) => /\p{Lu}/u.test(p) },
] as const;

export const passwordValid = (p: string) => PASSWORD_RULES.every((r) => r.test(p));
