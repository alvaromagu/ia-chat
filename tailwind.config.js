/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      backgroundColor: {
        dracula: '#282a36'
      },
      fontFamily: {
        'onest': 'Onest'
      }
    }
  },
  plugins: []
}