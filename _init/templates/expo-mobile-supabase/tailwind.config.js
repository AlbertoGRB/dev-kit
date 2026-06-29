/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Troque pela paleta da sua marca
        brand: {
          50: '#E6F1FB', 100: '#B5D4F4', 200: '#85B7EB', 400: '#378ADD',
          600: '#185FA5', 800: '#0C447C', 900: '#042C53',
        },
      },
    },
  },
  plugins: [],
};
