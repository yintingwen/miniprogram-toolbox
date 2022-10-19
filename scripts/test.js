import fs from 'fs'

async function run () {
  const res = await fs.readFileSync('node_modules/vue/package.json', 'utf-8')
  console.log(JSON.parse(res).dependencies);
}

run()