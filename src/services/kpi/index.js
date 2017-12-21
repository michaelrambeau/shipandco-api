const debug = require('debug')('api')
const mem = require('mem')

const fetchShipmentsByMonth = require('./shipments-by-month')
const fetchShipmentsByMethod = require('./shipments-by-method')
const fetchShipmentsByDay = require('./shipments-by-day')

const memOptions = { maxAge: 60 * 60 * 1000 } // 1 hours until the cache expires (in ms)

const memoize = fn => mem(fn, memOptions)

const requests = {
  'by-month': memoize(fetchShipmentsByMonth),
  'by-method': memoize(fetchShipmentsByMethod),
  'by-day': memoize(fetchShipmentsByDay),
  all: memoize(fetchAll)
}

function fetchAll(query) {
  return Promise.all([
    fetchShipmentsByMonth(query),
    fetchShipmentsByDay(query),
    fetchShipmentsByMethod(query)
  ]).then(([byMonth, byDay, byMethod]) => ({ byMonth, byDay, byMethod }))
}

class KPIService {
  async find(params) {
    debug('KPI request', params.query)
    const { query } = params
    const { type } = query
    const fetchData = requests[type] || fetchShipmentsByMonth
    const results = await fetchData(query).then(results => ({ results }))
    debug('Result OK!')
    return results
  }
}

module.exports = new KPIService()
