const CustomerModel = require('../customers/Customer')
const OrderModel = require('../orders/Order')
const ShipmentModel = require('../shipments/Shipment')
const ShopModel = require('../shops/Shop')

class DashboardService {
  find (params) {
    const getOrderCount = () => OrderModel
      .count()
    const getCustomerCount = () => CustomerModel
      .count()
    const getShipmentCount = () => ShipmentModel
      .count()
    const getShopCount = () => ShopModel
      .count()
    return Promise.all([
      getOrderCount(),
      getShipmentCount(),
      getCustomerCount(),
      getShopCount()
    ])
      .then(counters => {
        const [orders, shipments, users, shops] = counters
        return {
          counters: {
            orders,
            shipments,
            users,
            shops
          }
        }
      })
  }
}

const service = new DashboardService()

module.exports = service
