const fs = require('fs')
const path = require('path')
const glob = require('glob')

let data = {}

// get path file js
const arrayFileJsPath = glob.sync(
  path.resolve(__dirname) + '/seeds/**/_*.js',
  {
    nodir: true,
  },
)

arrayFileJsPath.forEach(fileJsPath => {
  const seed = require(fileJsPath)
  const key = Object.keys(seed)[0]
  const genData = (ok) => { return seed[key](ok) }

  const basename = path.basename(fileJsPath, '.js')
  const fileJsonPath = `${path.resolve(__dirname)}/seeds/gen/${basename}.json`

  // Read data from file gen JSON if exists
  if (fs.existsSync(fileJsonPath)) {
    let json = JSON.parse(fs.readFileSync(fileJsonPath, 'utf8'))

    // append data
    data[key] = json

    // Otherwise generate data from faker
  } else {
    // append data
    data[key] = genData(true)

    // Generate gen seed json
    writeFileGenJson(data[key], fileJsPath)
  }
})

// Generate master db.json
let json = JSON.stringify(data)
let filename = path.resolve(__dirname) + '/db.json'
writeFileJson(json, filename, `Generated ${filename}`)

// ========== Function ==========
function writeFileGenJson(payload, fileJsPath) {
  let basename = path.basename(fileJsPath, '.js') + '.json'
  let filename = path.resolve(__dirname) + '/seeds/gen/' + basename
  let json = JSON.stringify(payload)

  writeFileJson(json, filename, `Generated ${filename}`)
}

function writeFileJson(payload, filename, message) {
  fs.writeFile(filename, payload, 'utf8', function (err) {
    if (err) throw err
    console.log(message)
  })
}

