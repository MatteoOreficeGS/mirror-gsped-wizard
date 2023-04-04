module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'red-dhl': '#C73329',
        'red-dhl-dark': '#85211b',
        'yellow-dhl': '#FFCC35',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    ],
    }