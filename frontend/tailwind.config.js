/** @type {import('tailwindcss').Config} */
export default {
  mode: "jit",
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        nunito: ["Nunito", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
      colors: {
        primary: "#1a237e",
        secondary: "#283593",
        headingMain: {
          DEFAULT: "#193798",
          dark: "#668CFF",
        },
        headingSub: {
          DEFAULT: "#1A389C",
          dark: "#B2CFFF",
        },
        cardsSub: "#dbeafe",
        accent: "#7FFFD4",
      },
    },
  },
  plugins: [],
};
