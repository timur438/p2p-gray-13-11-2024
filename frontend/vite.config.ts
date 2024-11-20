import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from 'tailwindcss'
import tailwindcssNesting from 'tailwindcss/nesting'
import autoprefixer from 'autoprefixer'
import postcssImport from 'postcss-import'

const isBuild = process.argv.includes('build')

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 8080,
    open: false,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '/user-api'),
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        sourcemapExcludeSources: isBuild,
        entryFileNames: isBuild ? 'assets/[hash].js' : 'assets/[name].js',
        assetFileNames: isBuild ? 'assets/[hash][extname]' : 'assets/[name]-[hash][extname]',
        chunkFileNames: isBuild ? 'assets/[hash].js' : 'assets/[name].js',
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  css: {
    postcss: {
      plugins: [
        tailwindcssNesting(),
        postcssImport(),
        tailwindcss(),
        autoprefixer(),
      ],
    },
  },
  plugins: [
    vue(),
  ],
})
