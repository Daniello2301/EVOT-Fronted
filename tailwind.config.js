import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

let flowbitePlugin = null
try {
  flowbitePlugin = require('flowbite/plugin')
} catch {
  // Flowbite plugin is optional; keep Tailwind functional without it.
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
    './node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage:{
        'about': "url('/src/assets/about.jpg')"
      },
      colors: {
        primary: { "50": "#eff6ff", "100": "#dbeafe", "200": "#bfdbfe", "300": "#93c5fd", "400": "#60a5fa", "500": "#3b82f6", "600": "#2563eb", "700": "#1d4ed8", "800": "#1e40af", "900": "#1e3a8a", "950": "#172554" },
        'blue_dark':'#0C3D7E',
        'blue_primary':'#004AAD',
        'gray_primary':'#DCDAD9',
        'black_primary':'#252525',
        'white_primary':"#F9F9F9"
      },
      borderRadius: {
        evot: '0.875rem'
      },
      boxShadow: {
        'evot-card': '0 12px 30px -22px rgba(0, 74, 173, 0.45)',
        'evot-card-hover': '0 20px 42px -24px rgba(0, 74, 173, 0.5)'
      },
      spacing: {
        'ev-2': '0.5rem',
        'ev-3': '0.75rem',
        'ev-4': '1rem',
        'ev-6': '1.5rem',
        'ev-8': '2rem'
      },
      fontFamily: {
        'display': [
          'Sora',
          'Manrope',
          'ui-sans-serif',
          'system-ui',
          'sans-serif'
        ],
        'body': [
          'Manrope',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Noto Sans',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji'
        ],
        'sans': [
          'Manrope',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Noto Sans',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji'
        ]
      }
    },
  },
  plugins: flowbitePlugin ? [flowbitePlugin] : [],
}

