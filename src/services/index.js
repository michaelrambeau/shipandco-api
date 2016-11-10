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
    res.cookie('feathers-jwt', token, {
      maxAge: 1000 * 10
    })
    res.redirect('http://localhost:3000/')
  })

  app.get('/login/request', (req, res) => {
    const APP_URL = 'https://shipandco.auth0.com'
    const client_id = '3w7EXmzzpZ4dkQGQuO6yhYAIRbLrQVIb'
    // const client_id = 'DUuPWkiKhQexHjZbpVO7b9wKMj2f7tsq'
    const source = req.query.source
    const redirect_uri = `/login/success?source=${source}`
    // const auth0Client = 'eyJuYW1lIjoiYXV0aDAuanMiLCJ2ZXJzaW9uIjoiNi44LjAifQ'
    const url = `${APP_URL}/authorize?scope=openid&response_type=token&connection=google-oauth2&sso=true&client_id=${client_id}&redirect_uri=${redirect_uri}`
    res.redirect(url)
  })
  app.get('/login/callback', (req, res) => {
    const token = req.cookies['feathers-jwt']
    console.log('>>> token=', token);
    res.cookie('feathers-jwt', token, {
      maxAge: 1000 * 10
    })
    const url = req.query.source
    res.redirect(url)
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
