/* Run `auth-server` to check the authentication feature */
require('dotenv').config({ silent: true })
const path = require('path')
const feathers = require('feathers')
const rest = require('feathers-rest')
const hooks = require('feathers-hooks')
const memory = require('feathers-memory')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const Auth0Strategy = require('passport-auth0').Strategy
const errorHandler = require('feathers-errors/handler')
const auth = require('feathers-authentication')
const jwt = require('feathers-authentication-jwt')

const createStaffService = require('./src/services/staff-users')
const createAuth0Service = require('./src/services/auth0')

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
      cookie: { enabled: true }
    })
  )
  .use(errorHandler())
  .use('/', feathers.static(path.resolve(process.cwd(), 'public')))
  .configure(jwt({ service: 'staff-users' }))

const staffService = createStaffService({ app, name: 'staff-users' })
const auth0Service = createAuth0Service({ app })

app.listen(3030)

console.log('Feathers app started on 127.0.0.1:3030')
