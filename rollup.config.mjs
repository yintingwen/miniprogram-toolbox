import typescript from 'rollup-plugin-typescript2';
import replace from '@rollup/plugin-replace'
import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve'
import path from 'path'
import PackageJson from './utils/PackageJson.mjs'

const rollupConfig = []
const packege = process.env.PACKAGE
const example = process.env.EXAMPLE

const pkgDir = path.resolve(`./packages/${packege}`) // 目标目录
const pkg = new PackageJson(packege)
const platforms = example ? [example] : pkg.getPlatforms()

platforms.forEach(platform => { 
  const config = createBaseConfig(packege)

  if (example) { // 示例开发
    config.output.file = `./examples/${example}/libs/${packege}/index.js`
    config.output.sourcemap = true
    config.plugins.splice(1, 0, createReplace(platform))
    config.plugins.push(createResolve())
  } else { // 打包
    config.output.file =  path.resolve(pkgDir, 'dist', platform, 'index.js')
    config.plugins.splice(1, 0, createReplace(platform))
  }

  rollupConfig.push(config)
})
rollupConfig.push(createScriptConfig(packege))

if (pkg.get('miniprogram') !== 'dist') {
  pkg.set('miniprogram', 'dist')
}
pkg.insertScript('postinstall', 'node ./scripts/postinstall.js')
pkg.save()


function createScriptConfig (target) {
  const config = createBaseConfig(target)
  config.input = path.resolve('shared/postinstall.js')
  config.output.file =  path.join(pkgDir, 'scripts/postinstall.js')
  config.plugins.shift()
  return config
}

function createTypescript (packege) {
  return typescript({
    tsconfig: 'tsconfig.json',
    tsconfigOverride: {
      include: [
        `types/**/*`,
        `packages/${packege}/**/*`
      ],
    }
  })
}

function createResolve () {
  return resolve()
}

function createReplace (platform) {
  return replace({
    preventAssignment: true,
    values: {
      'PLATFORM_API': platform,
      'PLATFORM': JSON.stringify(platform)
    }
  })
}

function createBaseConfig (packege) {
  return {
    input: path.resolve(pkgDir, 'src/index.ts'),
    output: {
      format: 'esm',
      sourcemap: false
    },
    plugins: [
      createTypescript(packege),
      terser()
    ]
  }
}

export default rollupConfig