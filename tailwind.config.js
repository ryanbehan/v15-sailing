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
        'ink': '#0A1420',
        'panel': '#0F1D2E',
        'signal': '#E8332A',
        'accent': '#FF7167',
        'signal-dark': '#C92820',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
