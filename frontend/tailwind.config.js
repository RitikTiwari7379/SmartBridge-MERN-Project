module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      height: {
        "1/10": "10%",
        "9/10": "90%",
      },
      text: {
        orange: "#e1410d",
        coral: "#F67B50",
      },
      backgroundColor: {
        "app-black": "#121212",
        "app-orange": "#e1410d",
        "app-coral": "#F67B50",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
