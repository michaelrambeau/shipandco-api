const MongooseService = require('feathers-mongoose').Service
const Model = require('./Order')

class OrdersService extends MongooseService {
  find (params) {
    params.query = {
      state: 'active',
      $sort: {
        date: -1
      }
    }
    return super.find(params)
  }
}

const service = new OrdersService({
  Model,
  paginate: {
    default: 50,
    max: 100
  }
})

module.exports = service
