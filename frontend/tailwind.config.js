/** @type {import('tailwindcss').Config} */
export default {
  mode: "jit",
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
        headingMain: "#193798",
        headingSub: "#1A389C",
        accent: "#7FFFD4",
      },
    },
  },
  plugins: [],
};
