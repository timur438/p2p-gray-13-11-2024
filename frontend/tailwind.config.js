import pluginForms from '@tailwindcss/forms'

export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      sans: [
        '\'Roboto Flex Variable\'',
        'system-ui',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"',
      ],
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      primary: '#007AFF',
      white: '#FFFFFF',
    },
  },
  plugins: [
    pluginForms,
  ],
}
