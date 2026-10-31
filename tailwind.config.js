/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: token('bg'),
        surface: token('surface'),
        'surface-2': token('surface-2'),
        line: token('line'),
        fg: token('fg'),
        muted: token('muted'),
        faint: token('faint'),
        brand: token('brand'),
        'on-brand': token('on-brand'),
        gain: token('gain'),
        loss: token('loss'),
        accent: token('accent'),
        side: token('side'),
      },
      // Finer 5-step opacity scale (plus 12) so tints like bg-gain/12 or text-white/55 are generated.
      opacity: {
        12: '0.12', 15: '0.15', 35: '0.35', 45: '0.45', 55: '0.55', 65: '0.65', 85: '0.85', 95: '0.95',
      },
      fontFamily: {
        sans: ['"Instrument Sans"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Bricolage Grotesque"', '"Instrument Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        pop: '0 12px 32px -8px rgb(11 22 23 / 0.28)',
        lift: '0 1px 2px rgb(11 22 23 / 0.06)',
      },
      keyframes: {
        'sheet-up': {
          from: { transform: 'translateY(24px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'slide-in': { from: { transform: 'translateX(-100%)' }, to: { transform: 'translateX(0)' } },
        'toast-in': {
          from: { transform: 'translateY(12px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'sheet-up': 'sheet-up 0.22s ease-out',
        'fade-in': 'fade-in 0.18s ease-out',
        'slide-in': 'slide-in 0.24s ease-out',
        'toast-in': 'toast-in 0.2s ease-out',
      },
    },
  },
  plugins: [],
};
