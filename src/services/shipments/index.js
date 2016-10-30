const MongooseService = require('feathers-mongoose').Service
const Model = require('./Shipment')

class ShipmentsService extends MongooseService {
  find (params) {
    const $select = [
      'date',
      'userId',
      'type',
      'customer_name',
      'identifier',
      'shipping_address',
      'currency',
      'shipping_paid',
      'shipment_infos.carrier',
      'shipment_infos.tracking_number',
      'shipment_infos.service',
      'shipment_infos.method'
    ]
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
