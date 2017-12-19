const debug = require('debug')('api')
const fetchShipmentsByMonth = require('./shipments-by-month')
const fetchShipmentsByMethod = require('./shipments-by-method')
const fetchShipmentsByDay = require('./shipments-by-day')

const requests = {
  'by-month': fetchShipmentsByMonth,
  'by-method': fetchShipmentsByMethod,
  'by-day': fetchShipmentsByDay,
  all: fetchAll
}

function fetchAll(query) {
  return Promise.all([
    fetchShipmentsByMonth(query),
    fetchShipmentsByDay(query)
  ]).then(([byMonth, byDay]) => ({ byMonth, byDay }))
}

class KPIService {
  find(params) {
    debug('KPI request', params.query)
    const { query } = params
    const { type } = query
    const fetchData = requests[type] || fetchShipmentsByMonth
    return fetchData(query).then(results => ({ results }))
    // return Promise.resolve({ msg: 'OK' })
  }
}

module.exports = new KPIService()
