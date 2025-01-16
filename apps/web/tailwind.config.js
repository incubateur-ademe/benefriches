/** @type {import('tailwindcss').Config} */
import theme from "./src/shared/views/theme";

export default {
  prefix: "tw-",
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: ["selector", '[data-fr-theme="dark"]'],
  theme,
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
