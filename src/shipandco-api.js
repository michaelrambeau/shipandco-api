// Read secrets from `.env` file in local development mode
require('dotenv').config({ silent: true })

const path = require('path')
const feathers = require('feathers')
const rest = require('feathers-rest')
const hooks = require('feathers-hooks')
const bodyParser = require('body-parser')
const errorHandler = require('feathers-errors/handler')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')

// Application services
const startServices = require('./services')

const commonHooks = require('./hooks')

// Database connection
mongoose.Promise = global.Promise
const dbEnv = process.env.DB_ENV || 'SANDBOX'
const key = `MONGO_URL_${dbEnv.toUpperCase()}`
const url = process.env[key]
if (!url) throw new Error(`No env. variable '${key}'`)
console.log('Connecting to MongoDB', key);
mongoose.connect(url)

// Initialize the application
const app = feathers()
  .configure(rest())
  .configure(hooks())
  .use(cors())
  .use(cookieParser())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use('/', feathers.static(path.resolve(__dirname, '..', 'public')))

// Global hook (applies to all services) to protect all routes
// Must be called BEFORE starting all the services.
// app.mixins.push(function (service) {
//   service.before(commonHooks().before)
// })

startServices(app)

// app.before(commonHooks.before)

app.use(errorHandler())

const PORT = process.env.PORT || 3030
app.listen(PORT)

console.log('shipandco API started on port', PORT)
