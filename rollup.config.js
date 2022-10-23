import typescript from 'rollup-plugin-typescript2';
import replace from '@rollup/plugin-replace'
import { terser } from 'rollup-plugin-terser';
import fs from 'fs'
import path from 'path'

const rollupConfig = []
const target = process.env.TARGET
const pkgDir = path.resolve(`packages/${target}`)
const pkg = path.resolve(pkgDir, 'package.json')
const targetPkg = JSON.parse(fs.readFileSync(pkg, 'utf-8'))
const buildConfig = targetPkg.buildConfig || {}
const platforms = (buildConfig.platforms && buildConfig.platforms.length) ? buildConfig.platforms : ['js']
Reflect.deleteProperty(targetPkg, 'buildConfig')

platforms.forEach(platform => { 
  const libName = getLibName(target, platform)
  const libPkg = createPkg(libName)
  const config = createBaseConfig(target)
  if (platform === 'js') {
    config.output.file = `./libs/${target}/index.js`
  } else {
    config.output.file = `./libs/${libName}/index.js`
    config.plugins.splice(1, 0, createReplace(platform))
  }
  rollupConfig.push(config)
  fs.mkdirSync(`./libs/${libName}`, { recursive: true })
  fs.writeFileSync(`./libs/${libName}/package.json`, JSON.stringify(libPkg, null, 2))
})

function createTypescript (target) {
  return typescript({
    tsconfig: 'tsconfig.json',
    tsconfigOverride: {
      include: [
        `types/**/*`,
        `packages/${target}/**/*`
      ],
    }
  })
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

function createPkg (name) {
  const libPkg = { 
    ...targetPkg,
    main: `index.js`, 
    module: `index.js`, 
    types: `index.d.ts`, 
    name: `@elf/${name}` 
  }

  return libPkg
}

function createBaseConfig (target) {
  return {
    input: path.resolve(pkgDir, 'src/index.ts'),
    output: {
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      createTypescript(target),
      terser()
    ]
  }
}

function getLibName (target, platform) {
  return platform === 'js' ? target : `${target}-${platform}`
}

export default rollupConfig