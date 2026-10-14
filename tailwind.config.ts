import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["ui-sans-serif", "system-ui", "Inter", "sans-serif"] },
      colors: {
        cream: { 50: "#fbfaf7", 100: "#f4f2ec", 200: "#e8e5dc", 300: "#d6d2c6" },
        sage: { 50: "#f2f6f0", 100: "#e2eadf", 200: "#c8d8c3", 500: "#9db596", 600: "#7a9873", 700: "#5f7b59" },
        terracotta: { 50: "#fbf1ed", 100: "#f6dfd5", 200: "#ebc0ae", 500: "#c97b5a", 600: "#b8694a", 700: "#9a5238" },
        gold: { 50: "#fffbea", 100: "#fdf0b8", 200: "#f6df7e", 400: "#e8b84a", 700: "#8a6516" },
      },
    },
  },
  plugins: [],
} satisfies Config;
