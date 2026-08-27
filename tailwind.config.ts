import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { accent: "#4f7ef7" },
    },
  },
} satisfies Config;
