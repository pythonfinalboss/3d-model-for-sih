/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        command: {
          bg: '#070b12',
          surface: '#0b1322',
          card: 'rgba(15, 23, 42, 0.75)',
          border: 'rgba(56, 189, 248, 0.15)',
          borderHover: 'rgba(56, 189, 248, 0.4)',
        },
        cyan: {
          glow: '#38bdf8',
          accent: '#06b6d4',
          bright: '#22d3ee',
        },
        emerald: {
          glow: '#10b981',
          bright: '#34d399',
        },
        amber: {
          glow: '#f59e0b',
          bright: '#fbbf24',
        },
        rose: {
          glow: '#ef4444',
          bright: '#f87171',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Space Mono', 'Consolas', 'monospace'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'beacon': 'beacon 1.5s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        beacon: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(1.25)' },
        },
        glow: {
          '0%': { filter: 'drop-shadow(0 0 4px rgba(56, 189, 248, 0.4))' },
          '100%': { filter: 'drop-shadow(0 0 16px rgba(56, 189, 248, 0.8))' },
        }
      }
    },
  },
  plugins: [],
}
