// import minimist from "minimist"
import { execa } from 'execa'
import minimist from 'minimist'

const args = minimist(process.argv.slice(2))
const targets = args._.length ? args._ : ['wx']


async function run () {
  const tasks = targets.map(item => execa(`npx rollup --config ./rollup.config.js --environment target:${item}`, [],  { stdio: 'inherit' }))
  await Promise.all(tasks)
  console.log('build success')
}

run()


