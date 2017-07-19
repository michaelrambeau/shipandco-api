const CustomerModel = require('../customers/Customer')
const OrderModel = require('../orders/Order')
const ShipmentModel = require('../shipments/Shipment')
const ShopModel = require('../shops/Shop')
const StatsService = require('../stats')
const ShipmentService = require('../shipments')

class DashboardService {
  find(params) {
    const getOrderCount = () => OrderModel.count()
    const getCustomerCount = () => CustomerModel.count()
    const getShipmentCount = () => ShipmentModel.count()
    const getShopCount = () => ShopModel.count()
    const getStats = () => StatsService.find()
    const getLast10shipments = () => {
      const query = { $limit: 10 }
      return ShipmentService.find({ query })
    }
    return Promise.all([
      getOrderCount(),
      getShipmentCount(),
      getCustomerCount(),
      getShopCount(),
      getStats(),
      getLast10shipments()
    ]).then(results => {
      const [orders, shipments, users, shops, stats, lastShipments] = results
      const { topUsers } = stats
      return {
        counters: {
          orders,
          shipments,
          users,
          shops
        },
        topUsers,
        lastShipments: lastShipments.data
      }
    })
  }
}

const service = new DashboardService()

module.exports = service
