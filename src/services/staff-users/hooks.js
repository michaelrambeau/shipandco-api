const auth = require('feathers-authentication')
const canRegister = require('./can-register')

module.exports = {
  all: [auth.hooks.authenticate('jwt')],
  create: [canRegister]
}
