// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        border: '#e5e7eb',
        input: '#ffffff',
        ring: '#1e293b',
        'dark-border': '#1e293b',
        'dark-input': '#111827',
      },
      borderRadius: {
        '2xl': '1rem',
      },
      fontFamily: {
        mona: ['Mona Sans', '-apple-system', 'Inter', 'ui-sans-serif', 'system-ui', 
               'Segoe UI', 'Roboto', 'Ubuntu', 'Cantarell', 'Noto Sans', 'sans-serif', 
               'Helvetica Neue', 'Arial', 'Apple Color Emoji', 'Segoe UI Emoji', 
               'Segoe UI Symbol', 'Noto Color Emoji'],
      },
    },
  },
  plugins: [],
}