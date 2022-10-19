import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./packages/api/src/index.ts'],
  outDir: './packages/api/dist',
  format: 'esm',
  targe: 'es2015',
  dts: true
})