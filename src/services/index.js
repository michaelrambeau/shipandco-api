const path = require('path')

const auth0Service = require('./auth0')
const adminUsersService = require('./adminUsers')
const customersService = require('./customers')
const ordersService = require('./orders')
const shipmentsService = require('./shipments')
const shopsService = require('./shops')

const userEndPoint = '/admin-users'

function startServices (app) {
  app.configure(auth0Service(userEndPoint))
  adminUsersService(app, { endPoint: userEndPoint })
  // Set up our own custom redirect route for successful login
  app.get('/auth/success', function (req, res) {
    res.sendFile(path.resolve(__dirname, '..', '..', 'public', 'success.html'))
  })

  app.use('/customers', customersService)
  app.use('/orders', ordersService)
  app.use('/shipments', shipmentsService)
  app.use('/shops', shopsService)
}

module.exports = startServices
