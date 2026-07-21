import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        "muted-foreground": "rgb(var(--muted-foreground) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        lime: {
          400: "#a3e635",
          500: "#84cc16",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(to right, rgb(15 17 26 / 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgb(15 17 26 / 0.06) 1px, transparent 1px)",
        "radial-glow":
          "radial-gradient(circle at 50% 0%, rgba(99,102,241,0.16), transparent 50%)",
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out forwards",
        "fade-up": "fade-up 0.7s ease-out forwards",
        "fade-up-delay": "fade-up 0.7s ease-out 0.2s forwards",
        marquee: "marquee 30s linear infinite",
        "marquee-slow": "marquee 60s linear infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "blob-1": "blob 22s ease-in-out infinite",
        "blob-2": "blob 28s ease-in-out infinite reverse",
        "blob-3": "blob 32s ease-in-out infinite",
        "gradient-shift": "gradient-shift 8s ease infinite",
        "ping-soft": "ping-soft 2.5s cubic-bezier(0, 0, 0.2, 1) infinite",
        "bounce-subtle": "bounce-subtle 2s ease-in-out infinite",
        "typing-dot": "typing-dot 1.2s ease-in-out infinite",
        "border-flow": "border-flow 4s linear infinite",
        "grow-bar": "grow-bar 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "grow-bar-x": "grow-bar-x 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        spotlight: "spotlight 18s ease-in-out infinite",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        blob: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(40px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-30px, 30px) scale(0.95)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "ping-soft": {
          "75%, 100%": { transform: "scale(2.4)", opacity: "0" },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "typing-dot": {
          "0%, 60%, 100%": { transform: "translateY(0)", opacity: "0.4" },
          "30%": { transform: "translateY(-3px)", opacity: "1" },
        },
        "border-flow": {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "200% 0%" },
        },
        "grow-bar": {
          from: { transform: "scaleY(0)" },
          to: { transform: "scaleY(1)" },
        },
        "grow-bar-x": {
          from: { transform: "scaleX(0)" },
          to: { transform: "scaleX(1)" },
        },
        spotlight: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(20%, 10%)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;
