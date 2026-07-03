import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#1B4332",
          greenDark: "#123629",
          greenSoft: "#E7F3ED",
          amber: "#D97706",
          amberSoft: "#FFF4E5",
          bg: "#F6F8FB",
          ink: "#0F172A",
          muted: "#64748B",
          line: "#DDE5EF",
          success: "#047857",
          warning: "#B45309",
          danger: "#B91C1C"
        }
      },
      boxShadow: {
        soft: "0 12px 30px rgba(15, 23, 42, 0.08)",
        panel: "0 18px 45px rgba(15, 23, 42, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
