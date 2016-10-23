// Read secrets from `.env` file in local development mode
require('dotenv').config({ silent: true })

const path = require('path')
const feathers = require('feathers')
const rest = require('feathers-rest')
const hooks = require('feathers-hooks')
const bodyParser = require('body-parser')
const errorHandler = require('feathers-errors/handler')
const mongoose = require('mongoose')

// Application services
const startServices = require('./services')

// Database connection
mongoose.Promise = global.Promise
const url = process.env.MONGO_URL
mongoose.connect(url)

// Initialize the application
const app = feathers()
  .configure(rest())
  .configure(hooks())
  // Needed for parsing bodies (login)
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use('/', feathers.static(path.resolve(__dirname, '..', 'public')))

startServices(app)

app.use(errorHandler())

const PORT = 3030
app.listen(PORT)

console.log('API server started on port', PORT)
