import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["ui-sans-serif", "system-ui", "Inter", "sans-serif"] },
      colors: {
        cream: { 50: "#fbf8f3", 100: "#f5f0e6", 200: "#e9e1d0", 300: "#d8cdb6" },
        sage: { 50: "#f1f5ee", 100: "#e0e9d9", 200: "#c3d3b6", 500: "#7f9c6e", 600: "#668558", 700: "#506946" },
        terracotta: { 50: "#fbf0ec", 100: "#f6ddd3", 200: "#ebbba9", 500: "#cc6b49", 600: "#b85a3a", 700: "#954830" },
        gold: { 50: "#fffbea", 100: "#fdf0b8", 200: "#f6df7e", 400: "#e8b84a", 700: "#8a6516" },
      },
    },
  },
  plugins: [],
} satisfies Config;
