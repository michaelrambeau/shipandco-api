const debug = require('debug')('api')
const Customer = require('../../customers/Customer')
const fetchCustomersByMonth = require('./customers-by-month')
const fetchPaidCustomersByMonth = require('./paid-customers-by-month')

const requests = {
  'by-month': fetchCustomersByMonth,
  paid: fetchPaidCustomersByMonth,
  all: fetchAll
}

function fetchAll(query) {
  return Promise.all([fetchCustomersByMonth(query)]).then(([byMonth]) => ({
    byMonth
  }))
}

class KPIService {
  async find(params) {
    debug('KPI request', params.query)
    const { query } = params
    const { type } = query
    const fetchData = requests[type] || fetchCustomersByMonth
    const results = await fetchData({ Customer, query }).then(results => ({
      results
    }))
    debug('Result OK!')
    return results
  }
}

module.exports = new KPIService()
