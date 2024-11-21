/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      borderWidth: {
        0.5: '0.5px',
        1: '1px'
      }
    },
  },
  plugins: [],
}

