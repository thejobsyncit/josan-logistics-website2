/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          50: '#FFF4EE',
          100: '#FFE4D4',
          200: '#FFC4A3',
          300: '#FF9A66',
          400: '#FF7A33',
          500: '#F26722', // Official Lalamove Brand Orange
          600: '#D9520E', // Lalamove Hover Orange
          700: '#B53F05',
          800: '#913100',
          900: '#752700',
          950: '#421400',
        },
        brand: {
          orange: '#F26722',
          hover: '#D9520E',
          light: '#FFF4EE',
          dark: '#0F172A',
          card: '#FFFFFF',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'orange-glow': '0 10px 30px -5px rgba(242, 103, 34, 0.35)',
        'orange-sm': '0 4px 14px 0 rgba(242, 103, 34, 0.25)',
        'card': '0 10px 25px -5px rgba(15, 23, 42, 0.05), 0 8px 10px -6px rgba(15, 23, 42, 0.01)',
        'elevated': '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
