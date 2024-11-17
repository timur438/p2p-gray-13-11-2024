import {quasar, transformAssetUrls} from '@quasar/vite-plugin'
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import viteYaml from '@modyfi/vite-plugin-yaml'
import {resolve} from 'node:path'

const isBuild = process.argv.includes('build')

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve('./src'),
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        sourcemapExcludeSources: isBuild,
        entryFileNames: isBuild ? 'assets/[hash].js' : 'assets/[name].js',
        assetFileNames: isBuild ? 'assets/[hash][extname]' : 'assets/[name]-[hash][extname]',
        chunkFileNames: isBuild ? 'assets/[hash].js' : 'assets/[name].js',
      },
    },
  },
  server: {
    host: true,
    port: 8081,
    proxy: {
      '/api': {
        target: 'http://localhost:8000/',
        rewrite: (path) => path.replace(/^\/api/, '/admin-api'),
      },
    },
  },
  esbuild: {
    sourcesContent: !isBuild,
    legalComments: 'eof',
  },
  css: {
    modules: false,
    preprocessorOptions: {
      scss: {
        silenceDeprecations: [
          'mixed-decls',
          'legacy-js-api',
          'color-functions',
        ],
      },
    },
  },
  plugins: [
    vue({
      template: {transformAssetUrls},
    }),
    quasar({
      sassVariables: '@/css/variables.scss',
    }),
    viteYaml(),
  ],
})
