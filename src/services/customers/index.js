const CustomerModel = require('./Customer')
const OrderModel = require('../orders/Order')
const ShipmentModel = require('../shipments/Shipment')
const ShopModel = require('../shops/Shop')

const Service = require('feathers-mongoose').Service

class CustomerService extends Service {
  find (params) {
    params.query = {
      $select: ['emails', 'profile', 'carriers', 'createdAt']
    }
    return super.find(params)
      .then(result => {
        const docs = result.data
        const ids = docs.map(doc => doc._id)
        return ShopModel
          .find({
            userId: {
              $in: ids
            }
          })
          .select({ name: 1, type: 1, userId: 1, created_at: 1, lastSync: 1 })
          .then(shops => {
            return Object.assign({}, result, {
              // data: result.data.map(user => Object.assign({}, user.toObject()))
              data: result.data.map(user => Object.assign({}, user.toObject(), {
                shops: shops.filter(shop => shop.userId === user._id)
                // shops: []
              }))
            })
          })
      })
  }
  get (id, params) {
    const getUser = () => CustomerModel
      .findOne({ _id: id })
      .select({ signature: 0 })
      .lean()
    const getOrderCount = () => OrderModel
      .count({ userId: id })
    const getShipmentCount = () => ShipmentModel
      .count({ userId: id })
    const getOrderList = () => OrderModel
      .find({ userId: id, state: 'active' })
      .limit(50)
      .sort({ date: -1 })
      .select({
        date: 1,
        type: 1,
        customerName: 1,
        identifier: 1,
        'data.shipping_address': 1,
        'data.currency': 1,
        'data.total_price': 1
      })
    const getShipmentList = () => ShipmentModel
      .find({ userId: id })
      .limit(50)
      .sort({ date: -1 })
      .select({
        customer_name: 1,
        shipping_address: 1,
        identifier: 1,
        date: 1,
        currency: 1,
        shipping_paid: 1,
        declared_value: 1,
        'shipment_infos.carrier': 1,
        'shipment_infos.tracking_number': 1
      })
    const getShopList = () => ShopModel
      .find({ userId: id })
      .limit(50)
      .sort({ date: -1 })
      .select({ name: 1, type: 1, created_at: 1, lastSync: 1 })
    return Promise.all([
      getUser(),
      getOrderCount(),
      getOrderList(),
      getShipmentCount(),
      getShipmentList(),
      getShopList()
    ])
      .then(result => {
        const [user, orderCount, orders, shipmentCount, shipments, shops] = result
        return Object.assign({}, user, {
          orderCount,
          orders,
          shipmentCount,
          shipments,
          shops
        })
      })
  }
}

const service = new CustomerService({
  Model: CustomerModel,
  paginate: {
    default: 20,
    max: 100
  }
  // lean: true
})

module.exports = service
