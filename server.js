// ** Config: https://billyyyyy3320.com/en/2019/07/21/create-json-server-with-multiple-files/
// ** Ref:
// ....  https://zetcode.com/javascript/jsonserver/
// ....  https://github.com/robinhuy/fake-rest-api-nodejs

const port = 2705
const host = 'http://localhost'
const prefix_router = 'api'
const root = `${host}:${port}/${prefix_router}`
const source = './db.json'
// const tokenApi = 'QLEAR 52ca917ee38aeefca00f88fefe'

const path = require('path')
const chalk = require('chalk')
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router(source)
const middlewares = jsonServer.defaults({
  static: path.resolve(__dirname, 'public'),
  logger: false
})

const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')

server.set('port', port)
server.use(middlewares)

// Authenticate
// server.use((req, res, next) => {
//   if (!req.headers.authorization || req.headers.authorization != tokenApi ) {
//     res.status(401).jsonp({
//       code: 0,
//       error: "Unauthorized",
//       data: "",
//     })
//   } else  {
//     next();
//   }
//  })

// Set timestamp
server.use((req, _res, next) => {
  if (req.method === 'POST') {
    req.body.created_at = Date.now()
    req.body.updated_at = Date.now()
  }

  if (req.method === 'PUT' || req.method === 'PATCH') {
    req.body.updated_at = Date.now()
  }
  // Continue to JSON Server router
  next()
})

// Format payload
router.render = (req, res) => {
  try {
    res.status(200).jsonp({
      code: 1,
      error: "",
      data: res.locals.data,
      meta: {}
    })
  } catch (error) {
    res.status(500).jsonp({
      code: 0,
      error: "Internal Server Error",
      data: ''
    })
  }
}

// Show all http resources
server.get('/resources', async (_req, res) => {
  let routes = []
  await low(new FileAsync(source)).then(db => {
    let records = db.getState()
    for (const prop in records) {
      routes.push(`/${prefix_router}/${prop}`)
    }
  })

  res.jsonp({ resources: routes })
})

// Show all database
server.get('/db', async (_req, res) => {
  let records
  await low(new FileAsync(source)).then(db => {
    records = db.getState()
  })

  res.jsonp(records)
})

// Set endpoint api
server.use(`/${prefix_router}`, router)

// Run server
server.listen(port, () => {
  prettyPrint()
})

function prettyPrint() {
  console.log()
  console.log(chalk.cyan('  \\{^_^}/ hi'))

  console.log()
  console.log(chalk.gray('  Loading ' + source))
  console.log(chalk.gray('  Done'))

  // console.log()
  // console.log(chalk.bold('  Header'))
  // console.log(`  authorization=${tokenApi}`)

  console.log()
  console.log(chalk.bold('  Home'))
  console.log(`  ${host}:${port}`)

  console.log()
  console.log(chalk.bold('  Resources'))
  low(new FileAsync(source)).then(db => {
    let records = db.getState()
    for (const prop in records) {
      console.log(`  ${root}/${prop}`)
    }
  })
}
