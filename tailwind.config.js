/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#46434E",
        light: "#F2F3F2",
        body: "#7C808B",
        accent: "#7A8391",
        primary: {
          300: "#F2BB97",
          400: "#EC9E6A",
          500: "#E6813E",
          600: "#D4651B",
          700: "#A75016",
        },
        secondary: {
          300: "#55749B",
          400: "#435C7A",
          500: "#304258",
          600: "#1F2A38",
          700: "#0D1117",
        },
      },
      fontFamily: {
        sans: ["Poppins", "Ubuntu", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
