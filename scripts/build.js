import minimist from "minimist"
import { execa } from 'execa'
import esbuild from "esbuild"
import os from 'os'
import path from "path"
import fs from 'fs'

const args = minimist(process.argv.slice(2))

// if (args.length)

function runParallel(target, task) {
  const maxConcurrency = os.cpus().length
  const executing  = []
  const tasks = []

  for (const item of target) {
    const p = Promise.resolve().then(() => task(item))
  }
}

async function build (target) {
  const pkgDir = path.resolve( `packages/${target}`)
  const pkg = fs.readFileSync( `${pkgDir}/package.json`, 'utf-8')
  await execa('tsup', [], { stdio: 'inherit' })
}

execa('tsup', [],  { stdio: 'inherit' }).then(res => {
  console.log(res);
}).catch(res => console.log(res))
