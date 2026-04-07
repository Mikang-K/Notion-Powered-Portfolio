import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans:          ["var(--font-active-sans)", "sans-serif"],
        mono:          ["var(--font-active-mono)", "monospace"],
        "geist-sans":  ["var(--font-geist-sans)", "sans-serif"],
        "inter":       ["var(--font-inter)", "sans-serif"],
        "noto-sans":   ["var(--font-noto-sans-kr)", "sans-serif"],
        "noto-serif":  ["var(--font-noto-serif-kr)", "serif"],
        "geist-mono":  ["var(--font-geist-mono)", "monospace"],
        "jb-mono":     ["var(--font-jetbrains-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
