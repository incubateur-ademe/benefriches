/** @type {import('tailwindcss').Config} */
import theme from "./src/app/views/theme";

export default {
  prefix: "tw-",
  content: ["./src/**/*.{ts,tsx}"],
  theme,
  plugins: [],
};
