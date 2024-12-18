/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        float: "float 6s ease-in-out infinite",
      },
      fontFamily: {
        inter: ["Ubuntu", "sans-serif"],
      },

      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
      colors: {
        main: "#B12B89",
      },
    },
  },
  darkMode: "",
  plugins: [require("tailwindcss-animate")],
};
