/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // SSBT Fusion signature palette — "reactor" theme
        void: {
          950: "#06070d",
          900: "#0a0d16",
          800: "#10131f",
          700: "#161a2b",
          600: "#1e2338",
        },
        fusion: {
          cyan: "#2fe6d8",
          violet: "#8b5cf6",
          magenta: "#e8489c",
          gold: "#f7b733",
          ember: "#ff6b4a",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(47, 230, 216, 0.45)",
        "glow-violet": "0 0 40px -8px rgba(139, 92, 246, 0.5)",
        "glow-gold": "0 0 50px -10px rgba(247, 183, 51, 0.55)",
        "inner-glass": "inset 0 1px 0 0 rgba(255,255,255,0.08)",
      },
      backgroundImage: {
        "radial-fade":
          "radial-gradient(60% 60% at 50% 30%, rgba(139,92,246,0.20) 0%, rgba(6,7,13,0) 70%)",
        "reactor-grid":
          "linear-gradient(rgba(47,230,216,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(47,230,216,0.06) 1px, transparent 1px)",
      },
      animation: {
        "spin-slow": "spin 12s linear infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2.4s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: 0.55, transform: "scale(1)" },
          "50%": { opacity: 1, transform: "scale(1.06)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-500px 0" },
          "100%": { backgroundPosition: "500px 0" },
        },
      },
    },
  },
  plugins: [],
};
