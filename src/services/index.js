const path = require('path')

const auth0Service = require('./auth0')
const adminUsersService = require('./adminUsers')
const customersService = require('./customers')
const ordersService = require('./orders')
const shipmentsService = require('./shipments')
const shopsService = require('./shops')
const dashboardService = require('./dashboard')

const hooks = require('feathers-hooks')

const userEndPoint = '/admin-users'

function startServices (app) {
  app.configure(auth0Service(userEndPoint))
  adminUsersService(app, { endPoint: userEndPoint })
  // Set up our own custom redirect route for successful login
  app.get('/auth/success', function (req, res) {
    // res.sendFile(path.resolve(__dirname, '..', '..', 'public', 'success.html'))
    console.log(req.cookies);
    const token = req.cookies['feathers-jwt']
    console.log('token=', token);
    res.cookie('feathers-jwt', token)
    res.redirect('http://localhost:3000/')
  })

  app.use('/customers', customersService)
  app.use('/orders', ordersService)
  app.use('/shipments', shipmentsService)
  app.use('/shops', shopsService)
  app.use('/dashboard', dashboardService)

  // hooks
  app.service('shipments').after(hooks.remove('shipment_infos.label'))
}

module.exports = startServices
