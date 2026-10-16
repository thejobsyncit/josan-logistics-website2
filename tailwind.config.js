/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Redesigned Core Palette
        navy: {
          DEFAULT: '#0B1F3A',
          50: '#F5F7FA',
          100: '#E6EBF2',
          200: '#C7D4E4',
          300: '#9FB5D0',
          400: '#678BB3',
          500: '#3D6392',
          600: '#234471',
          700: '#153055',
          800: '#0E2442',
          900: '#0B1F3A', // Primary Navy
          950: '#061224',
        },
        orange: {
          DEFAULT: '#F26B21',
          50: '#FFF7F2',
          100: '#FFEDE0',
          200: '#FED8C2',
          300: '#FDBDA0',
          400: '#FA9461',
          500: '#F26B21', // Primary CTA Orange
          600: '#D95A13', // Hover Orange
          700: '#B6470C',
          800: '#92380C',
          900: '#77300D',
          950: '#401503',
        },
        brand: {
          navy: '#0B1F3A',
          'navy-light': '#132A4A',
          orange: '#F26B21',
          'orange-hover': '#D95A13',
          white: '#FFFFFF',
          'muted-on-dark': '#B6C2D1',
          'bg-light': '#F5F7FA',
          'text-dark': '#1B2733',
          light: '#F5F7FA',
          soft: '#F5F7FA',
          text: '#1B2733',
          muted: '#64748B',
          border: '#E2E8F0',
          'border-dark': '#1E3A5F',
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
        'card': '0 1px 3px 0 rgba(11, 31, 58, 0.05), 0 1px 2px -1px rgba(11, 31, 58, 0.03)',
        'subtle': '0 4px 6px -1px rgba(11, 31, 58, 0.05), 0 2px 4px -2px rgba(11, 31, 58, 0.03)',
        'elevated': '0 10px 15px -3px rgba(11, 31, 58, 0.08), 0 4px 6px -4px rgba(11, 31, 58, 0.04)',
      }
    },
  },
  plugins: [],
}
