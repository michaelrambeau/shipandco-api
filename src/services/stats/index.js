const debug = require('debug')('api')
const mapValues = require('lodash.mapvalues')
const pProps = require('p-props')
const ShipmentModel = require('../shipments/Shipment')
const topUsers = require('./top-users')
const byMonth = require('./shipments-by-month')
const build = require('./build-json')
const read = require('./read-json')

const getTopUsers = () => topUsers(ShipmentModel)
const getShipmentsByMonth = () => byMonth(ShipmentModel)

const settings = {
  topUsers: {
    fetchItems: getTopUsers,
    filename: 'top-users.json'
  },
  shipmentsByMonth: {
    fetchItems: getShipmentsByMonth,
    filename: 'by-month.json'
  }
}

const readItems = key => read(settings[key].filename)
const writeItems = key => {
  const requestSettings = settings[key]
  const { fetchItems, filename } = requestSettings
  debug('Feching aggregated data', key)
  return fetchItems().then(build(filename))
}

class StatsService {
  find(params) {
    const requests = mapValues(settings, (setting, key) => readItems(key))
    return pProps(requests)
  }
  create(data, params) {
    const requests = mapValues(settings, (setting, key) => writeItems(key))
    return pProps(requests)
  }
}

module.exports = new StatsService()
