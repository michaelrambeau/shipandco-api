const memory = require('feathers-memory')
const debug = require('debug')('api')

const hooks = require('./hooks')

const createService = ({ app, name }) => {
  debug(`Create the "${name}" service`, hooks)
  app.service(name, memory())
  app.service(name).before(hooks)
}

module.exports = createService
