/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#fbbf24',
        secondary: '#8b5cf6',
        success: '#10b981',
        info: '#3b82f6',
        danger: '#ef4444',
      },
      animation: {
        'pulse-correct': 'pulse 0.5s ease-in-out',
        'shake-incorrect': 'shake 0.5s ease-in-out',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-8px)' },
          '75%': { transform: 'translateX(8px)' },
        }
      }
    },
  },
  plugins: [],
}