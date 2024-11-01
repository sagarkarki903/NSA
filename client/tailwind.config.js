/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {colors: {
      maroon: {
        700: '#800000', // Customize with the exact shade of maroon you need
      },
    },},
  },
  plugins: [],
}

