const MongooseService = require('feathers-mongoose')
const Model = require('./Order')

const service = new MongooseService({
  Model,
  paginate: {
    default: 50,
    max: 100
  }
})

module.exports = service
