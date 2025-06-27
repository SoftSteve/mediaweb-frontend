/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          logocolor: '#e8e5df',
        },
        primary: '#4A6FA5',
        secondary: '#2C2F36',
        accent: '#EF6D60',
        success: '#48A999',
        warning: '#F4A259',
        error: '#D64545',
        background: '#FAFAFA',
        surface: '#F0F2F5',
        border: '#DADDE1',
        disabled: '#C8CCD0',
        overlay: 'rgba(0, 0, 0, 0.04)',
        text: {
          primary: '#1E1E1E',
          secondary: '#4C4F52',
          muted: '#6C737D',
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}