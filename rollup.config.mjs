import typescript from 'rollup-plugin-typescript2';
import replace from '@rollup/plugin-replace'
import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve'
import fs from 'fs'
import path, { join } from 'path'
import rimraf from 'rimraf';
import { getPlatforms } from './utils/buildConfig.mjs'
import { insertPostinstall } from './utils/script.mjs';

const rollupConfig = []
const packege = process.env.PACKAGE
const example = process.env.EXAMPLE

const pkgDir = path.resolve(`./packages/${packege}`) // 目标目录
const pkg = path.resolve(pkgDir, 'package.json') // 目标package.json路径
const targetPkg = JSON.parse(fs.readFileSync(pkg, 'utf-8'))
const platforms = getPlatforms(targetPkg, example)
const isMmultiple = platforms.length > 1
rimraf(join(pkgDir, 'dist'), () => {})

if (isMmultiple) {
  insertPostinstall(packege)
}

platforms.forEach(platform => { 
  const config = createBaseConfig(packege)

  if (example) { // 示例开发
    config.output.file = `./examples/${example}/libs/${packege}/index.js`
    config.output.sourcemap = true
    config.plugins.splice(1, 0, createReplace(platform))
    config.plugins.push(createResolve())
  } else { // 打包
    if (isMmultiple) { // 打包多平台
      config.output.file =  path.resolve(pkgDir, 'dist', platform, 'index.js')
    } else { // 打包单个
      config.output.file =  path.resolve(pkgDir, 'dist', 'index.js')
    }
    config.plugins.splice(1, 0, createReplace(platform))
  }

  rollupConfig.push(config)
})

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