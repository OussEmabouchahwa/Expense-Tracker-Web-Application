import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: {
          0: "var(--paper-0)",
          50: "var(--paper-50)",
          100: "var(--paper-100)",
        },
        ledger: {
          100: "var(--ledger-100)",
          200: "var(--ledger-200)",
          300: "var(--ledger-300)",
          400: "var(--ledger-400)",
          500: "var(--ledger-500)",
          700: "var(--ledger-700)",
          900: "var(--ledger-900)",
        },
        stamp: {
          100: "var(--stamp-100)",
          500: "var(--stamp-500)",
          600: "var(--stamp-600)",
          700: "var(--stamp-700)",
        },
        gain: {
          100: "var(--gain-100)",
          600: "var(--gain-600)",
        },
        loss: {
          100: "var(--loss-100)",
          600: "var(--loss-600)",
        },
        warn: {
          100: "var(--warn-100)",
          700: "var(--warn-700)",
        },
        line: "var(--line)",
      },
      fontFamily: {
        serif: ["var(--font-serif)"],
        sans: ["var(--font-sans)"],
      },
      borderRadius: {
        sm: "var(--r-sm)",
        md: "var(--r-md)",
        lg: "var(--r-lg)",
      },
      boxShadow: {
        float: "var(--shadow-float)",
      },
    },
  },
  plugins: [],
} satisfies Config;
