import { type Config } from "tailwindcss";
import daisyui from "daisyui";
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["light","dark"],
  },
  plugins: [daisyui],
} satisfies Config;
