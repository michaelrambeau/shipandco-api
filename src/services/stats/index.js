const ShipmentModel = require('../shipments/Shipment')
const topUsers = require('./top-users')
const build = require('./build-json')
const read = require('./read-json')

class StatsService {
  find() {
    return read('top-users.json').then(users => ({ topUsers: users }))
  }
  create() {
    return topUsers(ShipmentModel)
      .then(build('top-users.json'))
      .then(() => ({ status: 'OK' }))
  }
}

module.exports = new StatsService()
