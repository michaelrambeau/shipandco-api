const CustomerModel = require('./Customer')
const OrderModel = require('../orders/Order')

const ShipmentModel = require('../shipments/Shipment')
const shipmentFields = require('../shipments/fields')

const ShopModel = require('../shops/Shop')

const Service = require('feathers-mongoose').Service

// Return customer's data when calling `find` method to display the list of customers
function sendUser (user, shops) {
  const json = Object.assign({}, user.toObject(), {
    lastLogin: user.lastLogin, // add `lastLogin` virtual property (see the model)
    shops: shops.filter(shop => shop.userId === user._id)
  })
  delete json.services // remove unnessary data from the json response
  return json
}

class CustomerService extends Service {
  find (params) {
    const $select = ['emails', 'profile', 'carriers', 'createdAt', 'services'] // `services` is required to get access to lastLogin
    params.query = Object.assign({}, params.query, {
      $select
    })
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
            const json = Object.assign({}, result, {
              data: result.data.map(user => sendUser(user, shops))
            })
            return json
          })
      })
  }
  get (id, params) {
    const getUser = () => CustomerModel
      .findOne({ _id: id })
      .select({ signature: 0 })
      .lean()
    const getOrderCount = () => OrderModel
      .count({
        userId: id,
        state: 'active'
      })
    const getShipmentCount = () => ShipmentModel
      .count({ userId: id })
    const getOrderList = () => OrderModel
      .find({ userId: id, state: 'active' })
      .limit(100)
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
      .select(shipmentFields.reduce(
        (acc, field) => Object.assign({}, acc, {
          [field]: 1
        }),
        {}
      ))
    const getShopList = () => ShopModel
      .find({ userId: id })
      .limit(50)
      .sort({ date: -1 })
      .select({ name: 1, type: 1, created_at: 1, lastSync: 1 })
    const fetchBasicData = [
      getUser(),
      getShopList()
    ]
    const onlyBasicData = params.options && params.options.basic
    const fetchAdvancedData = [
      getOrderCount(),
      getOrderList(),
      getShipmentCount(),
      getShipmentList()
    ]
    const promises = fetchBasicData.concat(onlyBasicData ? [] : fetchAdvancedData)
    return Promise.all(promises)
      .then(result => {
        const [user, shops, orderCount, orders, shipmentCount, shipments] = result
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
    max: 1000
  }
  // lean: true
})

module.exports = service
