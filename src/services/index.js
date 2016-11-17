const auth0Service = require('./auth0')
const adminUsersService = require('./adminUsers')
const customersService = require('./customers')
const ordersService = require('./orders')
const shipmentsService = require('./shipments')
const shopsService = require('./shops')
const dashboardService = require('./dashboard')
const auth = require('feathers-authentication').hooks
const path = require('path')

const userEndPoint = '/admin-users'
const WEB_CLIENT_COOKIE = 'web-client-url'

function startServices (app) {
  // Add a middleware to write in a cookie where the user comes from
  // This cookie will be user later to redirect the user to the single-page application.
  app.get('/auth/auth0', (req, res, next) => {
    const { source, domain } = req.query
    if (source) {
      res.cookie(WEB_CLIENT_COOKIE, source)
      res.cookie('domain', domain)
    } else {
      res.clearCookie(WEB_CLIENT_COOKIE)
    }
    next()
  })
  // setup Auth0 service that will automatically create `/auth/auth0` route
  app.configure(auth0Service(userEndPoint))

  adminUsersService(app, { endPoint: userEndPoint })

  // Route called after a successful login
  // Redirect the user to the single-page application "forwarding" the auth token
  app.get('/auth/success', function (req, res) {
    const url = req.cookies[WEB_CLIENT_COOKIE]
    const domain = req.cookies['domain']
    if (url) {
      //  if there is a cookie that contains the URL source, redirect the user to this URL,
      // "forwarding" the short-term cookie that contains the user's token.
      const token = req.cookies['feathers-jwt']
      res.cookie('feathers-jwt', token, {
        maxAge: 1000 * 10, // will expire in 10 seconds
        domain
      })
      res.redirect(url)
    } else {
      // otherwise send the static page on the same domain.
      res.sendFile(path.resolve(process.cwd(), 'public', 'success.html'))
    }
  })

  // Register all REST services
  const services = {
    '/customers': customersService,
    '/orders': ordersService,
    'shipments': shipmentsService,
    '/shops': shopsService,
    '/dashboard': dashboardService
  }
  Object.keys(services).forEach(key => {
    app.use(key, services[key])
  })

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

module.exports = startServices
