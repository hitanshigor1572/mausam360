/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        imd: {
          navy: "#0a2540",
          navyDark: "#06182c",
          blue: "#1a56db",
          lightBlue: "#e1effe",
          sky: "#0284c7",
          gold: "#f59e0b",
          saffron: "#ea580c",
          green: "#059669",
          slate: "#334155"
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
