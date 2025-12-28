/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          100: '#f9f5eb',
          200: '#f4e8d0', // Your main background
          300: '#e8d7b8', // Darker parchment
          400: '#dec6a0',
          800: '#5c4d3c',
          900: '#2b1810', // Your "Ink" color
        },
        gold: {
          400: '#e5c04b',
          500: '#d4af37', // Your "Gold"
          600: '#b08d1a',
          700: '#8b7020', // Your "Dark Gold"
        },
        crimson: {
          DEFAULT: '#8b0000', // Your "Crimson"
          glow: '#ff0000',
        },
        sacred: {
          blue: '#1e3a5f', // Your "Sacred Blue"
        }
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        garamond: ['EB Garamond', 'serif'],
        unifraktur: ['UnifrakturMaguntia', 'cursive'], // For the big headers
      },
      backgroundImage: {
        'parchment-gradient': 'linear-gradient(to bottom, #f4e8d0, #e8d7b8)', //
        'dark-overlay': 'linear-gradient(135deg, #1a1410 0%, #2d2416 50%, #1a1410 100%)', //
      }
    },
  },
  plugins: [],
}