/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.tsx",
    "./*.ts",
    "./components/**/*.{tsx,ts}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          950: '#064e3b',
        }
      }
    },
  },
  plugins: [],
}
