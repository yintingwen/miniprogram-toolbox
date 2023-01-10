import { readdir, readFile, writeFile } from "fs"
import minimist from "minimist"
import { join, resolve } from "path"
import { promisify } from "util"

const args = minimist(process.argv.slice(2))
const target = args._[0]

async function transformTargetDts (target) {
  const disDir = resolve('packages', target, 'dist')
  const taskList = []
  const dists = await promisify(readdir)(disDir)
  const replace = dists.filter(item => item !== 'js')
  replace.forEach(item => taskList.push([join(disDir, item), item]))
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

target && transformTargetDts(target)