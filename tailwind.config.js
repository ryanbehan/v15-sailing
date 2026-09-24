/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './doc/**/*.md',
    './src/styles/**/*.css',
  ],
  theme: {
    extend: {
      colors: {
        'sunset-orange': '#FF6B3D',
        'navy-blue': '#001F3F',
        'sky-blue': '#7FDBFF',
        'white': '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
