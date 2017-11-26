const auth = require('feathers-authentication')
const customersService = require('./customers')
const ordersService = require('./orders')
const shipmentsService = require('./shipments')
const shopsService = require('./shops')
const warehousesService = require('./warehouses')
const dashboardService = require('./dashboard')
const checkSyncService = require('./check-sync')
const createBillingService = require('./payments')
const statsService = require('./stats')
const addressesService = require('./addresses')
const staffService = require('./staff-users')
const staffServiceHooks = require('./staff-users/hooks')
const createAuth0Service = require('./auth0')
const debug = require('debug')('api')

function startServices(app) {
  const auth0Service = createAuth0Service({ app })
  const dbEnv = process.env.DB_ENV || 'SANDBOX'
  const token = process.env[`STRIPE_TOKEN_${dbEnv.toUpperCase()}`]
  const billingService = createBillingService(token)

  const services = {
    '/staff-users': staffService,
    '/customers': customersService,
    '/orders': ordersService,
    '/shipments': shipmentsService,
    '/shops': shopsService,
    '/dashboard': dashboardService,
    '/warehouses': warehousesService,
    '/payments': billingService,
    '/addresses': addressesService,
    '/stats': statsService
  }

  // Register all REST services
  Object.keys(services).forEach(key => {
    app.use(key, services[key])
  })

  app.use('/check-sync', checkBatchToken, checkSyncService)

  // Register common hooks to restrict access to authenticated users
  const commonHooks = {
    all: [auth.hooks.authenticate(['jwt'])]
  }
  Object.keys(services).forEach(key => {
    const service = app.service(key)
    service.before(commonHooks)
  })
  app.service('staff-users').before(staffServiceHooks)
}

function checkBatchToken(req, res, next) {
  const requestToken = req.headers.authorization
  const batchToken = process.env.BATCH_TOKEN
  if (requestToken !== batchToken)
    return res.status(401).json({ msg: 'Auth error!' })
  next()
}

module.exports = startServices
