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
          DEFAULT: '#FF6B00',
          50: '#FFF8F2',
          100: '#FFE8D6',
          200: '#FFCEAD',
          300: '#FFAD7A',
          400: '#FF8A47',
          500: '#FF6B00', // Primary Brand Orange
          600: '#E55C00', // Hover Orange
          700: '#BF4B00',
          800: '#993900',
          900: '#7D2D00',
          950: '#471600',
        },
        navy: {
          DEFAULT: '#10182D',
          50: '#F5F7FC',
          100: '#E8ECF7',
          200: '#D5DCF0',
          300: '#B4C1E4',
          400: '#8A9ED4',
          500: '#647DBF',
          600: '#4760A5',
          700: '#334882',
          800: '#1F2E5B',
          900: '#10182D', // Primary Dark Navy
          950: '#0B1020',
        },
        brand: {
          orange: '#FF6B00',
          'orange-hover': '#E55C00',
          navy: '#10182D',
          'navy-light': '#1A243F',
          white: '#FFFFFF',
          light: '#FFF8F2',
          soft: '#F5F6F8',
          text: '#172033',
          muted: '#64748B',
          border: '#E2E8F0',
          success: '#16A34A',
          warning: '#F59E0B',
          error: '#DC2626',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(16, 24, 45, 0.05), 0 1px 2px -1px rgba(16, 24, 45, 0.03)',
        'subtle': '0 4px 6px -1px rgba(16, 24, 45, 0.05), 0 2px 4px -2px rgba(16, 24, 45, 0.03)',
        'elevated': '0 10px 15px -3px rgba(16, 24, 45, 0.08), 0 4px 6px -4px rgba(16, 24, 45, 0.04)',
        'orange-sm': '0 2px 8px 0 rgba(255, 107, 0, 0.25)',
      }
    },
  },
  plugins: [],
}
