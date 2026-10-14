import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["ui-sans-serif", "system-ui", "Inter", "sans-serif"] },
      colors: { gold: { 50: "#fffbeb", 100: "#fef3c7", 200: "#fde68a", 400: "#e8b84a", 700: "#92661a" } },
    },
  },
  plugins: [],
} satisfies Config;
