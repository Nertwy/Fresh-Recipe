import { type Config } from "tailwindcss";
import daisyui from "daisyui";
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["garden"],
  },
  plugins: [daisyui],
} satisfies Config;
