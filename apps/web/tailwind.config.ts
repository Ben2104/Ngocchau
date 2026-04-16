import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
        muted: "hsl(var(--muted))",
        accent: "hsl(var(--accent))",
        card: "hsl(var(--card))",
        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))"
      },
      backgroundImage: {
        "gold-grid":
          "radial-gradient(circle at 1px 1px, rgba(146, 64, 14, 0.08) 1px, transparent 0)"
      },
      boxShadow: {
        panel: "0 18px 45px -24px rgba(68, 64, 60, 0.35)"
      }
    }
  },
  plugins: []
};

export default config;

