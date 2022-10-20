import typescript from 'rollup-plugin-typescript2';
import replace from '@rollup/plugin-replace'
import minimist from 'minimist'

const args = minimist(process.argv.slice(2))
console.log(args);
console.log(process.env);

export default {
  input: './packages/api/src/index.ts',
  output: {
    dir: './packages/api/dist',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      tsconfigOverride: {
        include: ['packages/api/src/**/*'],
      }
    }),
    replace({
      'platformApi': 'my',
      'platform': JSON.stringify('alipay')
    })
  ]
}