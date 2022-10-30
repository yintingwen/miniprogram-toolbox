import { existsSync, mkdirSync, readFileSync, writeFile } from "fs"
import { join, resolve } from "path"
import { getPackageJson } from "./buildConfig.mjs"

export function insertPostinstall (target) {
  const pkg = getPackageJson(target)
  const postinstall = readFileSync('./shared/postinstall.js', 'utf-8')
  const scriptsDir = resolve('packages', target, 'scripts')
  if (!existsSync(scriptsDir)) {
    mkdirSync(scriptsDir)
  }
  writeFile(join('packages', target, 'scripts/postinstall.js'), postinstall, 'utf-8', (e) => {
    console.log(e);
  })
  pkg.scripts['postinstall'] = "node ./scripts/postinstall.js"
  writeFile(join('packages', target, 'package.json'), JSON.stringify(pkg, null, 2), 'utf-8', () => {})
}