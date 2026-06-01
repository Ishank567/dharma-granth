import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './data/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#fff8f0',
          100: '#ffefd6',
          200: '#ffdbac',
          300: '#ffc178',
          400: '#ff9f3d',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        dharma: {
          bg: 'var(--dharma-bg)',
          dark: '#1a1814',
          text: 'var(--dharma-text)',
          muted: 'var(--dharma-muted)',
          border: 'var(--dharma-border)',
          card: 'var(--dharma-card)',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-merriweather)', 'Georgia', 'serif'],
        devanagari: ['var(--font-noto-devanagari)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
