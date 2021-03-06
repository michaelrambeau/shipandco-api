// Read secrets from `.env` file in local development mode
require('dotenv').config({ silent: true })

const path = require('path')
const feathers = require('feathers')
const rest = require('feathers-rest')
const hooks = require('feathers-hooks')
const auth = require('feathers-authentication')
const bodyParser = require('body-parser')
const errorHandler = require('feathers-errors/handler')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const jwt = require('feathers-authentication-jwt')
const pingRequestHandler = require('./services/hyperping')

// Application services
const startServices = require('./services')

// Database connection
mongoose.Promise = global.Promise
const dbEnv = process.env.DB_ENV || 'SANDBOX'
const key = `MONGO_URL_${dbEnv.toUpperCase()}`
const url = process.env[key]
if (!url) throw new Error(`No env. variable '${key}'`)
console.log('Connecting to MongoDB', key) // eslint-disable-line no-console
mongoose.connect(url, { useMongoClient: true })

const app = feathers()
  .configure(rest())
  .configure(hooks())
  .use(cors())
  .use(cookieParser())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .configure(
    auth({
      secret: process.env.TOKEN_SECRET,
      servce: 'staff-users',
      cookie: { enabled: true },
      jwt: { expiresIn: '30d', subject: 'user' }
    })
  )
  .use('/', feathers.static(path.resolve(process.cwd(), 'public')))
  .configure(jwt({ service: 'staff-users' }))
  .post('/hyperping', pingRequestHandler)
startServices(app)

app.use(errorHandler())

const PORT = process.env.PORT || 3030
app.listen(PORT)

console.log('shipandco API started on port', PORT) // eslint-disable-line no-console
