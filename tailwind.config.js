/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F6F2E8',
        ink: '#20301F',
        rule: '#B4432E',
        rule2: '#D97A55',
        pine: '#1E3B2A',
        pine2: '#2E5240',
        clay: '#B4432E',
        gold: '#B8862F',
        leaf: '#4C7A52',
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
