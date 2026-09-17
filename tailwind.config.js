/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#182620",
        paper: "#F5F1E7",
        paperDim: "#ECE6D8",
        brass: "#A9793B",
        brassDark: "#8A6230",
        moss: "#3F5C48",
        rust: "#96412B",
        stone: "#6B6558",
        line: "#D9D2C0",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
      },
      letterSpacing: {
        tightish: "-0.01em",
      },
    },
  },
  plugins: [],
};
