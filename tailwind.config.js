module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'red-dhl': '#C73329',
        'yellow-dhl': '#FFCC35',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    ],
    }