const MongooseService = require('feathers-mongoose').Service
const Model = require('./Order')

const PAGINATION_MAX = 100

class OrdersService extends MongooseService {
  find(params) {
    params.query = Object.assign({}, params.query, {
      'meta.state': 'active',
      $sort: {
        'created_at.date': -1
      }
    })
    return super.find(params)
  }
}

const service = new OrdersService({
  Model,
  paginate: {
    default: 50,
    max: PAGINATION_MAX
  }
})

// Check the `$limit` parameter to prevent the service from returning too many records
// function checkLimitParameter (limit) {
//   return isNaN(limit) ? PAGINATION_MAX : Math.min(limit, PAGINATION_MAX)
// }

module.exports = service
