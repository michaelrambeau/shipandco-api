const debug = require('debug')('api')
const CustomerModel = require('../customers/Customer')
const helpers = require('../customers/helpers')
const Stats = require('../Stats')

class AddressService {
  find(params) {
    return Promise.all([
      Stats.find(),
      getCustomerListWithAddress()
    ]).then(([stats, users]) => {
      debug('Requests OK!', stats.topUsers, users)
      const userList = stats.topUsers
      return {
        total: users.length,
        limit: 1000,
        skip: 0,
        data: users.map(formatUser(userList))
      }
    })
  }
}

const findUserStats = (user, userList) => {
  const x = userList.find(item => item._id === user._id)
  return x
}

const formatUser = topUsers => user => {
  const stats = findUserStats(user, topUsers)
  const json = Object.assign({}, user.toObject(), {
    lastLogin: helpers.getLastLogin(user),
    shipmentCount: (stats && stats.count) || 0,
    lastShipment: stats && stats.lastShipment
  })
  delete json.services // remove unnessary data from the json response
  return json
}

function getCustomerListWithAddress(params) {
  const fields = { emails: 1, 'settings.defaultWarehouse': 1, services: 1 }
  const query = {
    'emails.verified': true,
    'settings.defaultWarehouse': { $exists: true }
  }
  return CustomerModel.find(query)
    .select(fields)
    .populate('settings.defaultWarehouse')
    .then(users => users.filter(user => !!user.settings.defaultWarehouse))
}

const service = new AddressService()

module.exports = service
