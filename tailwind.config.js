/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors : {
        blue : "#04BDF2",
        white : "#ffffff",
        darkblack : "#0B0E10",
        black : "#1A2128",
        radient : "#00FF66",
        dire : "#F00B0B"
      },

      fontFamily : {
        inter : "Inter",
        ribeye : "Ribeye Marrow",
        roboto : "Roboto Slab",
        sans : "Work Sans"
      },

      boxShadow : {
        imageBox : "0px 0px 4px 1px #04BDF2",
        profileBox : "0px 0px 4px 1px #00FF66"
      },

      dropShadow : {
        textShadow : "0px 0px 6px #04BDF2",
        greenShadow : "0px 0px 6px #00FF66"
      }
    },
  },
  plugins: [],
}