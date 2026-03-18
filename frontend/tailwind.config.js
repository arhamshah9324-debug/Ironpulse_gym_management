/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Bebas Neue', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        accent: 'var(--accent)',
        'accent-dark': 'var(--accent-dark)',
        'accent-warm': 'var(--accent-warm)',
        brand: 'var(--text-primary)',
        muted: 'var(--text-muted)',
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'hover': 'var(--shadow-hover)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'toast-enter': 'toastEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'toast-exit': 'toastExit 0.3s ease forwards',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(24px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        toastEnter: {
          from: { opacity: 0, transform: 'translateX(100%) scale(0.9)' },
          to: { opacity: 1, transform: 'translateX(0) scale(1)' },
        },
        toastExit: {
          from: { opacity: 1, transform: 'translateX(0) scale(1)' },
          to: { opacity: 0, transform: 'translateX(100%) scale(0.9)' },
        }
      }
    },
  },
  plugins: [],
}
