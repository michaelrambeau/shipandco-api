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
const createStaffService = require('./staff-users')
const createAuth0Service = require('./auth0')

function startServices(app) {
  const staffService = createStaffService({ app, name: 'staff-users' })
  const auth0Service = createAuth0Service({ app })

  const dbEnv = process.env.DB_ENV || 'SANDBOX'
  const token = process.env[`STRIPE_TOKEN_${dbEnv.toUpperCase()}`]
  const billingService = createBillingService(token)

  // Register all REST services
  const services = {
    '/customers': customersService,
    '/orders': ordersService,
    shipments: shipmentsService,
    '/shops': shopsService,
    '/dashboard': dashboardService,
    '/warehouses': warehousesService,
    '/payments': billingService,
    '/addresses': addressesService
  }
  Object.keys(services).forEach(key => {
    app.use(key, services[key])
  })

  app.use('/check-sync', checkBatchToken, checkSyncService)
  app.use('/stats', statsService)

  // Register common hooks to restrict access to authenticated users
  // const commonHooks = {
  //   all: [
  //     auth.hooks.authenticate('jwt')
  //     auth.verifyToken(),
  //     auth.populateUser(),
  //     auth.restrictToAuthenticated()
  //   ]
  // }
  // Object.keys(services).forEach(key => {
  //   app.service(key).before(commonHooks)
  // })
}

function checkBatchToken(req, res, next) {
  const requestToken = req.headers.authorization
  const batchToken = process.env.BATCH_TOKEN
  if (requestToken !== batchToken)
    return res.status(401).json({ msg: 'Auth error!' })
  next()
}

module.exports = startServices
