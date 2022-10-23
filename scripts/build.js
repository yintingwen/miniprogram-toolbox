// import minimist from "minimist"
import { execa } from 'execa'
import minimist from 'minimist'

const args = minimist(process.argv.slice(2))
const targets = args._
const watch = args.w

async function run () {
  console.log('build start')
  const tasks = targets.map(item => 
    execa('rollup' , 
      [
        '-c', 
        watch && '-w',
        '--environment',
        `TARGET:${item}`,
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