const debug = require('debug')('api')
const fetchShipmentsByMonth = require('./shipments-by-month')
const fetchShipmentsByMethod = require('./shipments-by-method')

const requests = {
  'by-month': fetchShipmentsByMonth,
  'by-method': fetchShipmentsByMethod
}

class KPIService {
  find(params) {
    debug('KPI request', params)
    const { query } = params
    const { type } = query
    const fetchData = requests[type] || fetchShipmentsByMonth
    return fetchData()
    // return Promise.resolve({ msg: 'OK' })
  }
}

module.exports = new KPIService()
