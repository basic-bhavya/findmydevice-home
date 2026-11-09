/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        hub: {
          dark: '#0f172a',
          card: '#1e293b',
          border: '#334155',
          accent: '#3b82f6'
        }
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ring-siren': 'siren 0.8s ease-in-out infinite'
      },
      keyframes: {
        siren: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.7)' },
          '50%': { transform: 'scale(1.03)', boxShadow: '0 0 25px 12px rgba(239, 68, 68, 0.4)' },
        }
      }
    },
  },
  plugins: [],
}
