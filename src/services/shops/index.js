const MongooseService = require('feathers-mongoose').Service
const Model = require('./Shop')

class ShopsService extends MongooseService {
  find (params) {
    params.query = Object.assign({}, params.query, {
    })
    return super.find(params)
  }
}

const service = new ShopsService({
  Model,
  paginate: {
    default: 50,
    max: 100
  }
})

module.exports = service
