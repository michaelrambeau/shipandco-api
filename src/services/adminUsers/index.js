const mongooseService = require('feathers-mongoose')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const fields = require('./fields')
// const hooks = require('./hooks')

const schema = new Schema(fields, {
  collection: 'adminUsers'
})

function createService(app, { endPoint, dbAdminUserConnection }) {
  const Model = dbAdminUserConnection.model('AdminUser', schema)
  const service = mongooseService({
    Model,
    paginate: {
      default: 20,
      max: 100
    },
    lean: true
  })

  // Initialize our service with any options it requires
  app.use(endPoint, service)

  // Get our initialize service to that we can bind hooks
  const userService = app.service(endPoint)

  // Set up our before hooks
  // userService.before(hooks.before)
  // Set up our after hooks
  // userService.after(hooks.after)
}

module.exports = createService
