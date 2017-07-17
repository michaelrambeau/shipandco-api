const MongooseService = require('feathers-mongoose').Service
const Model = require('./Warehouse')

class WarehousesService extends MongooseService {
  find(params) {
    return super.find(params)
  }
  get(id, params) {
    return super.get(id, params)
  }
}

const service = new WarehousesService({
  Model,
  paginate: {
    default: 50,
    max: 100
  }
})

module.exports = service
