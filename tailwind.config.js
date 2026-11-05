/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#10182b',
        'ink-deep': '#070c1a',
        parchment: '#f3ead3',
        'parchment-dim': '#e8dcb8',
        brass: '#b9862e',
        'brass-bright': '#d9a548',
        trail: '#3f5b43',
        'trail-light': '#6b8a70',
        rust: '#9c4a30',
        charcoal: '#241f1a',
        fog: '#cfd6c9',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'monospace'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
