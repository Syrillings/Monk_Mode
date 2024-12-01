/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        josefin: ["Josefin Sans", "sans-serif"],
        italianno: ["Italianno", "cursive"],
        monty: ["Montserrat", "sans-serif"],
        openSans: ["Open Sans", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        playfair: ['Playfair', 'serif'],
        georgia: ['Georgia', 'serif']

      },
      colors: {
        mine: "#d9b2d1",
        pine: "#A9509D",
        bine: "#F6D6EF",
        tine: "#A53396",
        tines: "#620B57",
        rine: "#FFF3F3",
        dine: "##9B127F",
        sine: "DE7DD1"
      },
      spacing: {
        18: "4.5rem",
        42.25: "169px",
        43.25: "259px",
        0.09: "160px",
      },
      boxShadow: {
        custom: "0 4px 6px rgba(0, 0, 255, 0.4)", 
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
