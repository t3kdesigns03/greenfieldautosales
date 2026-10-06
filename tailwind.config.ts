import type { Config } from "tailwindcss";

/**
 * Brand tokens live as CSS variables in app/globals.css (:root).
 * Tailwind reads them here so `bg-field`, `text-ink/70`, etc. all work
 * and a color change is a one-line edit in globals.css.
 */
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "375px",
      },
      colors: {
        night: token("night"),
        panel: { DEFAULT: token("panel"), 2: token("panel-2"), 3: token("panel-3") },
        fg: token("fg"),
        muted: token("muted"),
        brand: { DEFAULT: token("brand"), deep: token("brand-deep") },
        go: token("go"),
        leaf: token("leaf"),
        gold: token("gold"),
        cream: token("cream"),
        paper: token("paper"),
        ink: token("ink"),
        rust: { DEFAULT: token("rust"), fg: token("rust-fg") },
        signal: token("signal"),
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      minHeight: { tap: "44px" },
      minWidth: { tap: "44px" },
      height: { tap: "44px" },
      width: { tap: "44px" },
      borderRadius: { card: "1.25rem" },
      boxShadow: {
        card: "0 1px 0 rgb(255 255 255 / 0.04) inset, 0 10px 30px -18px rgb(0 0 0 / 0.8)",
        lift: "0 1px 0 rgb(255 255 255 / 0.06) inset, 0 24px 50px -20px rgb(0 0 0 / 0.9)",
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(90% 70% at 85% 0%, rgb(var(--gold) / 0.16) 0%, transparent 60%), radial-gradient(80% 60% at 0% 100%, rgb(var(--brand) / 0.45) 0%, transparent 70%), linear-gradient(180deg, rgb(var(--panel)) 0%, rgb(var(--night)) 100%)",
      },
      keyframes: {
        "draw-road": {
          from: { strokeDashoffset: "var(--dash, 400)" },
          to: { strokeDashoffset: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "rise-in": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "sheet-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
      },
      animation: {
        "draw-road": "draw-road 1.4s cubic-bezier(.65,0,.35,1) forwards",
        "fade-in": "fade-in .5s ease both",
        "rise-in": "rise-in .6s cubic-bezier(.2,.7,.2,1) both",
        "sheet-up": "sheet-up .28s cubic-bezier(.2,.7,.2,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
