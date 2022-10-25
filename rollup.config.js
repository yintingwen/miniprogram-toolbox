import typescript from 'rollup-plugin-typescript2';
import replace from '@rollup/plugin-replace'
import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve'
import fs from 'fs'
import path from 'path'
import config from './config.js'

const rollupConfig = []
const packege = process.env.PACKAGE
const example = process.env.EXAMPLE

const pkgDir = path.resolve(`packages/${packege}`)
const pkg = path.resolve(pkgDir, 'package.json')
const targetPkg = JSON.parse(fs.readFileSync(pkg, 'utf-8'))
const buildConfig = targetPkg.buildConfig || {}
const platforms = getPlatforms()

Reflect.deleteProperty(targetPkg, 'buildConfig')
platforms.forEach(platform => { 
  const libName = getLibName(packege, platform)
  const libPkg = createPkg(libName)
  const config = createBaseConfig(packege)

  if (example) {
    config.output.file = `./examples/${example}/libs/${packege}/index.js`
    config.plugins.splice(1, 0, createReplace(platform))
    config.plugins.push(createResolve())
  } else if ( platform === 'js' ) {
    config.output.file = `./libs/${packege}/dist/index.js`
  } else {
    config.output.file = `./libs/${libName}/dist/index.js`
    config.plugins.splice(1, 0, createReplace(platform))
  }

  rollupConfig.push(config)
  fs.mkdirSync(`./libs/${libName}`, { recursive: true })
  fs.writeFileSync(`./libs/${libName}/package.json`, JSON.stringify(libPkg, null, 2))
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

function createPkg (name) {
  const libPkg = { 
    ...targetPkg,
    main: `dist/index.js`, 
    module: `dist/index.js`, 
    types: `dist/index.d.ts`, 
    name: config.organization ? `@${config.organization}/${name}` : name
  }

  return libPkg
}

function createBaseConfig (packege) {
  return {
    input: path.resolve(pkgDir, 'src/index.ts'),
    output: {
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      createTypescript(packege),
      terser()
    ]
  }
}

function getLibName (packege, platform) {
  return platform === 'js' ? packege : `${packege}-${platform}`
}

function getPlatforms () {
  console.log(example);
  if (example) {
    return [example]
  } else {
    const { platforms } = buildConfig
    return (platforms && platforms.length) ? platforms : ['js']
  }
}

export default rollupConfig