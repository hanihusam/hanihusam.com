/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    screens: {
      md: "640px",
      lg: "1024px",
      xl: "1440px", // this is the "design resolution"
    },
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
    extend: {
      fontFamily: {
        sans: ["Satoshi", ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        xl: "1.375rem", // 22px
        "2xl": "1.5625rem", // 25px
        "3xl": "1.875rem", // 30px
        "4xl": "2.5rem", // 40px
        "5xl": "3.125rem", // 50px
        "6xl": "3.75rem", // 60px
        "7xl": "4.375rem", // 70px
      },
      gridTemplateRows: {
        "max-content": "max-content",
      },
      spacing: {
        "5vw": "5vw", // pull featured sections and navbar in the margin
        "8vw": "8vw", // positions hero img inside the margin
        "10vw": "10vw", // page margin
      },
      maxWidth: {
        "8xl": "96rem",
      },
      maxHeight: {
        "50vh": "50vh", // max height for medium size hero images
        "75vh": "75vh", // max height for giant size hero images
      },
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
