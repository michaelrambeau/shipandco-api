const MongooseService = require('feathers-mongoose').Service
const Model = require('./Shop')
const CustomerService = require('../customers')
const OrdersService = require('../orders')
const ShipmentsService = require('../shipments')
const WarehousesService = require('../warehouses')

class ShopsService extends MongooseService {
  find(params) {
    const $select = ['meta', 'settings', 'sync']
    params.query = Object.assign({}, params.query, { $select })
    return super.find(params)
  }
  get(id, params) {
    const getCustomer = userId => CustomerService.get(userId, { basic: true })
    const getOrders = shopId =>
      OrdersService.find({ query: { 'meta.shop_id': shopId, $limit: 10 } })
    const getShipments = shopId =>
      ShipmentsService.find({ query: { 'meta.shop_id': shopId, $limit: 10 } })
    const getWarehouse = _id =>
      _id &&
      WarehousesService.get(_id).catch(e => {
        if (e.name === 'NotFound')
          return Promise.resolve({ _id, deleted: true })
        throw e
      })
    return super
      .get(id, params)
      .then(shop => {
        const promises = [
          getCustomer(shop.meta.user_id),
          getOrders(shop._id),
          getShipments(shop._id),
          getWarehouse(shop.meta.warehouse_id)
        ]
        console.log('Fetching all data...')
        return Promise.all(
          promises
        ).then(([user, orders, shipments, warehouse]) =>
          Object.assign({}, shop, {
            user,
            orders,
            shipments,
            warehouse
          })
        )
      })
      .catch(e => {
        throw e
      })
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
