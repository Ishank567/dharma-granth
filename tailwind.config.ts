import type { Config } from 'tailwindcss';

const config: Config = {
  // Follow the site's own theme switcher (ThemeProvider sets data-theme on
  // <html>), not the OS colour scheme, so `dark:` matches what users picked.
  darkMode: ['selector', '[data-theme="night"]'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
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
          600: '#cf440a',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        dharma: {
          bg: 'var(--dharma-bg)',
          dark: '#1a1814',
          text: 'var(--dharma-text)',
          'text-secondary': 'var(--dharma-text-secondary)',
          muted: 'var(--dharma-muted)',
          border: 'var(--dharma-border)',
          card: 'var(--dharma-card)',
          'card-soft': 'var(--dharma-card-soft)',
          panel: 'var(--dharma-panel)',
          'panel-muted': 'var(--dharma-panel-muted)',
          reading: 'var(--dharma-reading-surface)',
          gold: 'var(--dharma-gold)',
          saffron: 'var(--dharma-saffron)',
          maroon: 'var(--dharma-maroon)',
          success: 'var(--dharma-success)',
          warning: 'var(--dharma-warning)',
          error: 'var(--dharma-error)',
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
