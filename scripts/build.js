// import minimist from "minimist"
import { execa } from 'execa'
import minimist from 'minimist'

const args = minimist(process.argv.slice(2))
const targets = args._
const watch = args.w
const example = args.e

async function run () {
  const tasks = targets.map(item => 
    execa('rollup' , 
      [
        '-c', 
        (example || watch) && '-w',
        '--environment',
        [
          `PACKAGE:${item}`,
          example && `EXAMPLE:${example}`
        ].filter(Boolean)
      ].filter(Boolean), 
      { stdio: 'inherit' }
    )
  )
  try {
    await Promise.all(tasks)
    console.log('build success')
  } catch (error) {
    console.log('build error', error)
  }
}

run()