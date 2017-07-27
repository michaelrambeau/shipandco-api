const CustomerModel = require('../customers/Customer')
const helpers = require('../customers/helpers')

class AddressService {
  find(params) {
    return getCustomerListWithAddress()
  }
}

function formatUser(user) {
  const json = Object.assign({}, user.toObject(), {
    lastLogin: helpers.getLastLogin(user)
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
    .then(users => ({
      total: users.length,
      limit: 1000,
      skip: 0,
      data: users.map(formatUser)
    }))
}

const service = new AddressService()

module.exports = service
