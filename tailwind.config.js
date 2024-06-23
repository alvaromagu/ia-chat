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
      },
      keyframes: {
        'fade-in-right': {
          '0%': {
            transform: 'translateX(-100%)'
          },
          '100%': {
            transform: 'translateX(0)'
          }
        },
        'fade-out-left': {
          '0%': {
            transform: 'translateX(0)'
          },
          '100%': {
            transform: 'translateX(-100%)'
          }
        }
      },
      animation: {
        'fade-in-right': 'fade-in-right 0.5s ease-out forwards',
        'fade-out-left': 'fade-out-left 0.5s ease-out forwards'
      }
    }
  },
  plugins: []
}