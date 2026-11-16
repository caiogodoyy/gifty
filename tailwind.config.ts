import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["ui-sans-serif", "system-ui", "Inter", "sans-serif"] },
      colors: {
        cream: { 50: "#f8f4ee", 100: "#f1ece3", 200: "#e8e1d5", 300: "#d6cdbd" },
        ink: { DEFAULT: "#4a2c22", soft: "#7a665e" },
        sage: { 50: "#f1f5ee", 100: "#e0e9db", 200: "#c9d9c3", 500: "#9db596", 600: "#8aa683", 700: "#5f7b59" },
        terracotta: { 50: "#fbf0ea", 100: "#f6dfd5", 200: "#ebc0ae", 500: "#c9704f", 600: "#bf6244", 700: "#9f4e33" },
        gold: { 50: "#fffbea", 100: "#fdf0b8", 200: "#f6df7e", 400: "#e8b84a", 700: "#8a6516" },
      },
    },
  },
  plugins: [],
} satisfies Config;
