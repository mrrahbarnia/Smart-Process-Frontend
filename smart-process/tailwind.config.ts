import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        'custom-bg': "linear-gradient(to left bottom, rgba(0,0,0,0) 0%, rgba(255,255,255, 0.7) 50%, rgba(255,255,255) 100%), url('/images/background.png')"
      }
    },
  },
  plugins: [],
};
export default config;
