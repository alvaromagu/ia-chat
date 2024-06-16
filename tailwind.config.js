/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      backgroundColor: {
        dracula: '#282a36',
        oneLight: 'rgb(250, 250, 250)'
      },
      fontFamily: {
        'onest': 'Onest'
      }
    }
  },
  plugins: []
}