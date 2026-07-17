import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#1B4332",
          greenDark: "#123629",
          greenMid: "#2D6A4F",
          greenSoft: "#E8F2EC",
          amber: "#D97706",
          amberSoft: "#FFF4E5",
          bg: "#F4F7F5",
          mist: "#E7EEE9",
          ink: "#14201A",
          muted: "#5C6B63",
          line: "#D5E0D9",
          success: "#047857",
          warning: "#B45309",
          danger: "#B91C1C"
        }
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 10px 28px rgba(18, 54, 41, 0.07)",
        panel: "0 22px 50px rgba(18, 54, 41, 0.12)",
        lift: "0 8px 20px rgba(18, 54, 41, 0.10)"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        "soft-pulse": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "0.9" }
        }
      },
      animation: {
        "fade-up": "fade-up 0.55s ease-out both",
        "fade-in": "fade-in 0.45s ease-out both",
        "soft-pulse": "soft-pulse 4s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
