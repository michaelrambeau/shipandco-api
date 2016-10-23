const MongooseService = require('feathers-mongoose').Service
const Model = require('./Shipment')

class ShipmentsService extends MongooseService {
  find (params) {
    params.query = {
      $select: [
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
    }
    return super.find(params)
  }
}

const service = new ShipmentsService({
  Model,
  paginate: {
    default: 50,
    max: 100
  }
})

module.exports = service
