const auth0Service = require('./auth0')
const adminUsersService = require('./adminUsers')
const path = require('path')

const userEndPoint = '/admin-users'

function startServices (app) {
  app.configure(auth0Service(userEndPoint))
  adminUsersService(app, { endPoint: userEndPoint })

  // Set up our own custom redirect route for successful login
  app.get('/auth/success', function (req, res) {
    res.sendFile(path.resolve(__dirname, '..', '..', 'public', 'success.html'))
  })
}

module.exports = startServices
