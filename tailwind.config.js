/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/views/**/*.ejs",
    "./public/**/*.js",
    "./public/css/**/input.css"
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#2D2D2D',
          card: '#3A3A3A',
          item: '#3F3F3F',
          border: '#444444',
          text: '#EDEDED',
          secondary: '#A8A8A8',
        },
        priority: {
          high: '#E14B4B',
          medium: '#D9A63A',
          low: '#47B985',
        },
        btn: {
          primary: '#5B46E5',
          'primary-dark': '#32277F',
          delete: '#FF5E5E',
          edit: '#9E9E9E',
        },
        scroll: {
          bg: '#EEEEEE',
          thumb: '#777777',
          arrow: '#555555',
        }
      },
      fontFamily: {
        'space': ['"Space Mono"', 'monospace'],
      },
      backdropBlur: {
        '20': '20px',
      },
    },
  },
  plugins: [],
}
