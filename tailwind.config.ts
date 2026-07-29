import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        editorial: ["var(--font-editorial)", "Georgia", "serif"],
      },
      colors: {
        cream: "#F5F0E8",
        "cream-dark": "#EDE8DE",
        brown: {
          DEFAULT: "#3D2B1F",
          light: "#6B4A35",
          dark: "#1A0F08",
        },
        gold: "#C9A96E",
        "warm-gray": "#8C7B6B",
      },
      letterSpacing: {
        widest: "0.2em",
        ultrawide: "0.3em",
      },
    },
  },
  plugins: [],
};

export default config;
