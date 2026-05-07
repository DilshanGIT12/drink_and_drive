/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a1a1a',
          light: '#2a2a2a',
          dark: '#000000',
        },
        accent: {
          DEFAULT: '#facc15', // Yellow for visibility/caution
          hover: '#eab308',
        }
      }
    },
  },
  plugins: [],
}
