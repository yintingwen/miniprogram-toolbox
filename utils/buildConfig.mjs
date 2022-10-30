import { readFileSync } from "fs"
import { resolve } from "path"

export function getPlatforms (pkg, example) {
  if (example)  return [example]
  const { buildConfig = {} }  = pkg
  const { platforms } = buildConfig
  return (platforms && platforms.length) ? platforms : ['js']
}

export function getPackageJson (target) {
  const path = resolve('packages', target, 'package.json')
  const pkg = readFileSync(path, 'utf-8')
  return JSON.parse(pkg)
}