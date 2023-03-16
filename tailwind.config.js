/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        black: "#46434E",
        white: "#FFFFFF",
        dark: "#434343",
        light: "#F2F2F2",
        body: "#7C808B",
        accent: "#7A8391",
        base: "#E0E0E0",
        primary: {
          300: "#F2BB97",
          400: "#EC9E6A",
          500: "#E6813E",
          600: "#D4651B",
          700: "#A75016",
        },
        secondary: {
          300: "#7398C7",
          400: "#55749B",
          500: "#45577B",
          600: "##304258",
          700: "#1F2A38",
        },
      },
      fontFamily: {
        sans: ["Satoshi", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
