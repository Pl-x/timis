/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        timis: {
          primary: '#0D2B4E',
          accent: '#F5A623',
          surface: '#F7F9FC',
          card: '#FFFFFF',
          'dark-surface': '#0A1929',
          'dark-card': '#112240',
          success: '#1A8C5B',
          warning: '#E87C2B',
          danger: '#C0392B',
          muted: '#6B7A8D',
          border: '#E2E8F0',
          'dark-border': '#1E3A5F',
        },
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: { card: '12px' },
      boxShadow: {
        card: '0 2px 12px rgba(13,43,78,0.08)',
        'card-dark': '0 2px 12px rgba(0,0,0,0.3)',
      },
      animation: {
        'fade-up': 'fadeUp 180ms ease-out',
        'score-fill': 'scoreFill 300ms ease-out',
        'pulse-ring': 'pulseRing 1.5s ease-out',
      },
      keyframes: {
        fadeUp: { from: { opacity: '0', transform: 'translateY(4px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        scoreFill: { from: { strokeDashoffset: '283' }, to: {} },
        pulseRing: { '0%': { transform: 'scale(1)', opacity: '1' }, '100%': { transform: 'scale(1.5)', opacity: '0' } },
      },
    },
  },
  plugins: [],
};
