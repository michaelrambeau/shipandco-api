const MongooseService = require('feathers-mongoose').Service
const Model = require('./Shop')
const CustomerService = require('../customers')
const OrdersService = require('../orders')
const ShipmentsService = require('../shipments')

class ShopsService extends MongooseService {
  find (params) {
    params.query = Object.assign({}, params.query, {
    })
    return super.find(params)
  }
  get (id, params) {
    const getCustomer = shopId => CustomerService.get(shopId)
    const getOrders = shopId => OrdersService.find({ query: { shopId } })
    const getShipments = shopId => ShipmentsService.find({ query: { shopId } })
    return super.get(id, params)
      .then(shop => {
        const promises = [
          getCustomer(shop.userId),
          getOrders(shop._id),
          getShipments(shop._id)
        ]
        return Promise.all(promises)
          .then(([user, orders, shipments]) => Object.assign({}, shop.toObject(), {
            user,
            orders,
            shipments
          }))
      })
      .catch(e => { throw e })
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
