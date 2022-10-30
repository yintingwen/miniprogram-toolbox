import { execa } from 'execa'
import { readdir, readFile, writeFile } from 'fs'
import minimist from 'minimist'
import { join, resolve } from 'path'
import { promisify } from 'util'
import { getPackageJson, getPlatforms } from '../utils/buildConfig.mjs'

const args = minimist(process.argv.slice(2))
const targets = args._
const watch = args.w
const example = args.e

async function run () {
  const tasks = targets.map(build)
  try {
    await Promise.all(tasks)
    console.log('build success')
  } catch (error) {
    console.log('build error', error)
  }
}

async function build (target) {
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
  await transformTargetDts(target)
}

async function transformTargetDts (target) {
  const pkg = getPackageJson(target)
  const platforms = getPlatforms(pkg)
  const disDir = resolve('packages', target, 'dist')
  if (platforms.length === 1 && platforms[0] === 'js') return
  const taskList = []
  if (platforms.length === 1) {
    taskList.push([disDir, platforms[0]])
  } else {
    const dists = await promisify(readdir)(disDir)
    const replace = dists.filter(item => item !== 'js')
    replace.forEach(item => taskList.push([join(disDir, item), item]))
  }
  return Promise.all(taskList.map(item => replaceCoreType(...item)))
}

async function replaceCoreType (path, platform) {
  const dtsPath = join(path, 'index.d.ts')
  let content = await promisify(readFile)(dtsPath, 'utf-8')
  const varList = ['PLATFORM_API', 'PLATFORM']
  varList.forEach(item => {
    content = content.replaceAll(new RegExp(item, 'g'), platform)
  })
  await promisify(writeFile)(dtsPath, content, "utf-8")
}

run()