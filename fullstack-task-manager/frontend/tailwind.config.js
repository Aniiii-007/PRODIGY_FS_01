/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef5ee',
          100: '#fce8d6',
          200: '#f8ccac',
          300: '#f3a877',
          400: '#ed7640',
          500: '#e8531a',
          600: '#d93d10',
          700: '#b42d10',
          800: '#902614',
          900: '#742213',
        },
        dark: {
          50: '#f6f6f7',
          100: '#e1e3e5',
          200: '#c3c6cc',
          300: '#9ea3ad',
          400: '#7a818e',
          500: '#616875',
          600: '#4d525d',
          700: '#40444c',
          800: '#373a41',
          900: '#1a1c20',
        },
      },
      fontFamily: {
        display: ['Outfit', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
