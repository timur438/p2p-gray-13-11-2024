import {defineConfig, UserConfig} from 'vite'
import * as fs from 'node:fs/promises'
import {resolve} from 'node:path'


export default defineConfig(async () => {
  const pkg = JSON.parse(await fs.readFile('./package.json', 'utf-8'))

  const externals = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
    /^node:/,
  ]

  return <UserConfig>{
    build: {
      minify: true,
      sourcemap: true,
      lib: {
        entry: {
          main: './src/main.ts',
          start: './src/start.ts',
        },
        formats: ['es'],
        name: 'index',
      },
      target: 'esnext',
      rollupOptions: {
        output: {
          sourcemapExcludeSources: true,
        },
        external: id => externals.some(ext => ext instanceof RegExp ? ext.test(id) : id.startsWith(ext)),
      },
    },
    resolve: {
      alias: {
        '@': resolve('./src'),
      },
    },
    plugins: [
    ],
  }
})
