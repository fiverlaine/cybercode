/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Space Mono"', 'monospace'],
      },
      colors: {
        'neon-green': '#0fa',
        'neon-blue': '#0cf',
        'cyber-black': '#0f1118',
        'cyber-gray': '#1a1b26',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s infinite alternate',
        'flow-right': 'flow-right 3s infinite',
        'fadeIn': 'fadeIn 0.5s ease-in forwards',
        'fadeOut': 'fadeOut 0.5s ease-out forwards',
        'slideInRight': 'slideInRight 0.3s ease-out forwards',
      },
      keyframes: {
        'pulse-glow': {
          '0%': { 'text-shadow': '0 0 5px #0cf, 0 0 10px #0cf' },
          '100%': { 'text-shadow': '0 0 10px #0fa, 0 0 20px #0fa, 0 0 30px #0fa' },
        },
        'flow-right': {
          '0%': { 'transform': 'translateX(-100%)' },
          '100%': { 'transform': 'translateX(100%)' },
        },
        'fadeIn': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fadeOut': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'slideInRight': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};