import { execa } from 'execa'
import minimist from 'minimist'
import { resolve } from 'path'
import rimraf from 'rimraf'


const args = minimist(process.argv.slice(2))
const targets = args._
const watch = args.w
const example = args.e

async function run () {
  const tasks = targets.map(build)
  try {
    console.log('build start');
    await Promise.all(tasks)
    console.log('build success')
  } catch (error) {
    console.log('build error', error)
  }
}

async function build (target) {
  rimraf.sync(resolve(`packages/${target}/dist`))
  await execa('rollup', 
    [
      '-c', 
      (example || watch) && '-w',
      '--environment',
      [
        `PACKAGE:${target}`,
        example && `EXAMPLE:${example}`
      ].filter(Boolean)
    ].filter(Boolean), 
    { stdio: 'inherit' }
  )
  const { stdout } = await execa(`node ./scripts/typeFix.mjs ${target}`)
  console.log(stdout);
}

run()