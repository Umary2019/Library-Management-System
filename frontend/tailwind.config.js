/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefaf7',
          100: '#d6f3eb',
          200: '#ade8d8',
          300: '#74d5be',
          400: '#3db99b',
          500: '#1f9a80',
          600: '#147c66',
          700: '#125f4f',
          800: '#124d41',
          900: '#103f35'
        },
        accent: '#f97316'
      },
      boxShadow: {
        soft: '0 20px 45px rgba(16, 63, 53, 0.12)'
      },
      backgroundImage: {
        hero: 'radial-gradient(circle at top left, rgba(61,185,155,0.28), transparent 35%), radial-gradient(circle at bottom right, rgba(249,115,22,0.24), transparent 30%), linear-gradient(135deg, #09211d 0%, #0f3b33 45%, #143e3b 100%)'
      }
    }
  },
  plugins: []
};
