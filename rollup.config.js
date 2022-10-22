import typescript from 'rollup-plugin-typescript2';
import replace from '@rollup/plugin-replace'
import fs from 'fs'

const rollupConfig = []
const target = process.env.TARGET
const pkgDir = `./packages/${target}`
const pkg = JSON.parse(fs.readFileSync(`./${pkgDir}/package.json`, 'utf-8'))
const { buildConfig } = pkg

buildConfig.platforms.forEach(platform => { 
  const config = createConfig(target, platform)
  rollupConfig.push(config)
  const libPkg = { 
    ...pkg,
    main: `dist/index.js`, 
    module: `dist/index.js`, 
    types: `dist/index.d.ts`, 
    name: `@elf/${target}-${platform}` 
  }
  Reflect.deleteProperty(libPkg, 'buildConfig')
  fs.mkdirSync(`./libs/${target}-${platform}`, { recursive: true })
  fs.writeFileSync(`./libs/${target}-${platform}/package.json`, JSON.stringify(libPkg, null, 2))
})

function createConfig (target, platform) {
  return {
    input: './packages/api/src/index.ts',
    output: {
      dir: `./libs/${target}-${platform}/dist`,
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        tsconfigOverride: {
          include: [
            `shared/**/*`,
            `packages/${target}/**/*`
          ],
        }
      }),
      replace({
        preventAssignment: true,
        values: {
          'PLATFORM_API': 'my',
          'PLATFORM': JSON.stringify('alipay')
        }
      })
    ]
  }
}

export default rollupConfig