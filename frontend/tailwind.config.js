export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: {
          DEFAULT: '#191919',
          card: '#141414',
          elevated: '#1a1a1a',
        },
        baby: {
          blue: '#6EC6E6',
          'blue-dim': '#4a9ab5',
          'blue-glow': 'rgba(110, 198, 230, 0.15)',
        }
      },
      fontFamily: {
        heading: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}