/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#1C1917",
        backgroundLight: "#262626",
      },
    },
  },
  plugins: [],
};
