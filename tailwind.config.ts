import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#080B12",
        foreground: "#F8FAFC",
        card: "#111827",
        "card-elevated": "#151B2B",
        border: "#273244",
        muted: "#64748B",
        "muted-foreground": "#94A3B8",
        demand: "#38BDF8",
        opportunity: "#22C55E",
        review: "#FACC15",
        risk: "#EF4444",
        intelligence: "#A855F7",
        competition: "#FB923C",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
        ],
      },
      boxShadow: {
        "lab-glow": "0 0 0 1px rgba(39, 50, 68, 0.64), 0 18px 60px rgba(0, 0, 0, 0.28)",
      },
    },
  },
  plugins: [],
};

export default config;
