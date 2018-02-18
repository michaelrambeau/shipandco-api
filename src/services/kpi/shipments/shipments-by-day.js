const flow = require('lodash.flow')
const subDays = require('date-fns/sub_days')
// const debug = require('debug')('api')

function fetchShipmentsByDay({ Shipment, query }) {
  const today = new Date()
  const fromDate = subDays(today, 100)
  const { carrier, user, shop } = query
  const isSet = value => value && value !== '*'
  const $project = {
    date: '$meta.created_at',
    year: { $year: '$meta.created_at' },
    month: { $month: '$meta.created_at' },
    day: { $dayOfMonth: '$meta.created_at' },
    carrier: '$delivery.carrier',
    user: '$meta.user_id',
    shop: '$meta.type'
  }

  const $match = flow([
    _ => (isSet(user) ? Object.assign({}, _, { user: user }) : _),
    _ => (isSet(carrier) ? Object.assign({}, _, { carrier: carrier }) : _),
    _ => (isSet(shop) ? Object.assign({}, _, { shop: shop }) : _)
  ])({
    date: { $gte: fromDate }
  })

  const _id = flow([
    _ => (isSet(carrier) ? Object.assign({}, _, { carrier: '$carrier' }) : _),
    _ => (isSet(user) ? Object.assign({}, _, { user: '$user' }) : _),
    _ => (isSet(shop) ? Object.assign({}, _, { shop: '$shop' }) : _)
  ])({
    year: '$year',
    month: '$month',
    day: '$day'
  })

  const $group = {
    _id,
    count: { $sum: 1 }
  }

  const $sort = { _id: 1 }

  const pipeline = [
    // { $match: { state: { $ne: 'void' } } },
    { $project },
    { $match },
    { $group },
    { $sort }
  ]
  return Shipment.aggregate(pipeline).then(formatResults)
}

// function formatResults(results) {
//   return results.reduce(
//     (acc, item) =>
//       Object.assign({}, acc, {
//         [`${item._id.year}/${item._id.month}`]: item.count
//       }),
//     {}
//   )
// }
function formatResults(results) {
  return results.map(item => ({
    year: item._id.year,
    month: item._id.month,
    day: item._id.day,
    count: item.count
  }))
}

module.exports = fetchShipmentsByDay
