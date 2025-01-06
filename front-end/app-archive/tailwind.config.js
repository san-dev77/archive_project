require("framer-motion");

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      color: {
        "dark-blue": "#0b1121",
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
