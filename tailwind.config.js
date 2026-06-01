/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6', // Brand violet
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        trello: {
          blue: '#0079bf',
          green: '#51e898',
          yellow: '#f2d600',
          orange: '#ff9f1a',
          red: '#eb5a46',
          surface: '#f4f5f7',
          darkSurface: '#121212',
          card: '#ffffff',
          darkCard: '#1e1e1e',
        },
        monday: {
          blue: '#00cff4',
          green: '#00c875',
          yellow: '#e1b300',
          red: '#df2f4a',
          purple: '#784bd1',
          bg: '#f6f7fa',
          darkBg: '#0b0c10',
          gridBorder: '#e6e9ef',
          darkGridBorder: '#292c35',
        }
      }
    },
  },
  plugins: [],
}
