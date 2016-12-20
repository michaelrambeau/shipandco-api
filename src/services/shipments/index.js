const MongooseService = require('feathers-mongoose').Service
const Model = require('./Shipment')
const fields = require('./fields')

class ShipmentsService extends MongooseService {
  find (params) {
    const $select = fields
    params.query = Object.assign({}, params.query, {
      $select
    })
    return super.find(params)
  }
  get (id, params) {
    return Model.findOne({_id: id}).select({ 'shipment_infos.label': 0 })
    // return super.get(id, params)
  }
}

const service = new ShipmentsService({
  Model,
  paginate: {
    default: 50,
    max: 100
  }
})

// service.after(hooks.remove('shipping_infos.label'));

module.exports = service
