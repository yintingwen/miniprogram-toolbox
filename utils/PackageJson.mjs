import { readFileSync, writeFile } from "fs"
import { resolve } from "path"

export function writePackageJson (pkg, target) {
  writeFile(join('packages', target, 'package.json'), JSON.stringify(pkg, null, 2), 'utf-8', () => {})
}

export default class PackageJson {
  path = ''
  content = {}

  constructor (target) {
    this.path = resolve('packages', target, 'package.json')
    this.content = JSON.parse(readFileSync(this.path, 'utf-8'))
  }

  getPlatforms () {
    const { buildConfig = {} } = this.content
    const { platforms } = buildConfig
    return (platforms && platforms.length) ? platforms : ['js']
  }

  insertScript (name, script) {
    this.content.scripts[name] = script
  }

  save () {
    writeFile(this.path, JSON.stringify(this.content, null, 2), 'utf-8', () => {})
  }

  get (key) {
    return this.content[key]
  }

  set (key, value) {
    this.content[key] = value
  }
}