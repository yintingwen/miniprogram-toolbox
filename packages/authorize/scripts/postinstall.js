const { readdirSync, readFileSync, writeFileSync, existsSync } = require('fs')
const { resolve, join } = require('path')
const rimraf = require('rimraf')

const projectDir = __dirname.split('node_modules')[0] // 项目目录
const projectPkg =  require(join(projectDir, 'package.json')) 
const packagePkg = require(resolve('package.json')) // 包json

const disDir = resolve('dist')
const platform = getPlatform()
const buildConfig = packagePkg.buildConfig || {}
const platforms = buildConfig.platforms || [] // 打的包

if (platforms.length <= 1) process.exit(0)
if (!platform) throw new Error('无法自动检测平台，请在package.json中通过platform指定')
  
const packageDir = join(disDir, platform)
const packageFiles = readdirSync(packageDir)
packageFiles.forEach((file) => {
  const filePath = join(packageDir, file)
  const fileContent = readFileSync(filePath, 'utf-8')
  writeFileSync(join(disDir, file), fileContent, 'utf-8')
})
platforms.forEach(package => {
  rimraf(join(disDir, package), () => {})
})

function getPlatform () {
  const css = ['wxss', 'ttss', 'acss', 'css']
  const cssPlatform = ['wx', 'tt', 'my', 'xhs']
  const cssIndex = css.findIndex(item =>  existsSync(join(projectDir, `app.${item}`)))
  return cssPlatform[cssIndex] || projectPkg.platform
}