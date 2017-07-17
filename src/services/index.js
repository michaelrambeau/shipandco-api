const auth0Service = require('./auth0')
const adminUsersService = require('./adminUsers')
const customersService = require('./customers')
const ordersService = require('./orders')
const shipmentsService = require('./shipments')
const shopsService = require('./shops')
const warehousesService = require('./warehouses')
const dashboardService = require('./dashboard')
const checkSyncService = require('./check-sync')
const paymentsService = require('./payments')

const auth = require('feathers-authentication').hooks
const path = require('path')

const userEndPoint = '/admin-users'
const WEB_CLIENT_COOKIE = 'web-client-url'

function startServices(app, { dbAdminUserConnection }) {
  // Add a middleware to write in a cookie where the user comes from
  // This cookie will be user later to redirect the user to the single-page application.
  app.get('/auth/auth0', (req, res, next) => {
    const { origin } = req.query
    if (origin) {
      res.cookie(WEB_CLIENT_COOKIE, origin)
    } else {
      res.clearCookie(WEB_CLIENT_COOKIE)
    }
    next()
  })
  // setup Auth0 service that will automatically create `/auth/auth0` route
  app.configure(auth0Service(userEndPoint))

  adminUsersService(app, {
    endPoint: userEndPoint,
    dbAdminUserConnection
  })

  // Route called after a successful login
  // Redirect the user to the single-page application "forwarding" the auth token
  app.get('/auth/success', (req, res) => {
    const origin = req.cookies[WEB_CLIENT_COOKIE]
    if (origin) {
      //  if there is a cookie that contains the URL source, redirect the user to this URL
      const token = req.cookies['feathers-jwt']
      const redirectUrl = `${origin}/auth0.html#${token}`
      res.redirect(redirectUrl)
    } else {
      // otherwise send the static page on the same domain.
      res.sendFile(path.resolve(process.cwd(), 'public', 'success.html'))
    }
  })

  // Register all REST services
  const services = {
    '/customers': customersService,
    '/orders': ordersService,
    shipments: shipmentsService,
    '/shops': shopsService,
    '/dashboard': dashboardService,
    '/warehouses': warehousesService,
    '/payments': paymentsService
  }
  Object.keys(services).forEach(key => {
    app.use(key, services[key])
  })

  app.use('/check-sync', checkBatchToken, checkSyncService)

  // Register common hooks to restrict access to authenticated users
  const commonHooks = {
    all: [
      auth.verifyToken(),
      auth.populateUser(),
      auth.restrictToAuthenticated()
    ]
  }
  Object.keys(services).forEach(key => {
    app.service(key).before(commonHooks)
  })
}

function checkBatchToken(req, res, next) {
  const requestToken = req.headers.authorization
  const batchToken = process.env.BATCH_TOKEN
  if (requestToken !== batchToken)
    return res.status(401).json({ msg: 'Auth error!' })
  next()
}

module.exports = startServices
