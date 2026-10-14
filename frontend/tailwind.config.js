/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./features/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#142B55',
          gold: '#D4AF37',
          yellow: '#FACC15',
          light: '#F8FAFC',
          dark: '#0F172A'
        }
      }
    },
  },
  plugins: [],
};