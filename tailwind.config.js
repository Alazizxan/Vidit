/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'spin-slower': 'spin-slower 30s linear infinite',
        'glow-slow': 'glow-slow 8s ease-in-out infinite',
        'noise': 'noise 8s steps(10) infinite',
      },
    },
  },
  plugins: [],
};