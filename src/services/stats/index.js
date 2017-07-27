const ShipmentModel = require('../shipments/Shipment')
const topUsers = require('./top-users')
const byMonth = require('./shipments-by-month')
const build = require('./build-json')
const read = require('./read-json')

const buildTopUsers = () =>
  topUsers(ShipmentModel).then(build('top-users.json'))
const buildShipmentsByMonth = () =>
  byMonth(ShipmentModel).then(build('by-month.json'))

const requests = {
  'top-users': buildTopUsers
}

class StatsService {
  find(params) {
    return read('top-users.json').then(users => ({ topUsers: users }))
  }
  create(data, params) {
    return buildShipmentsByMonth().then(() => ({ status: 'OK' }))
  }
}

module.exports = new StatsService()
