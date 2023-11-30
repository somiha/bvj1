/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/js/**/*.{html,js,ejs}",
    "./public/js/***/**/*.{html,js,ejs}",
    "./src/views/**/*.{html,js,ejs}",
    "./src/views/***/**/*.{html,js,ejs}"
  ],
  theme: {
    listStyleType: {
      none: 'none',
      disc: 'disc',
      decimal: 'decimal',
      circle: 'circle',
    },
    extend: {
      height: {
        '120': '30rem'
      }
    },
  },
  plugins: [],
}
