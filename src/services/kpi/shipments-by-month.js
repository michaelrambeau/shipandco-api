const Shipment = require('../shipments/Shipment')
const flow = require('lodash.flow')
// const debug = require('debug')('api')

function fetchShipmentsByMonth(query) {
  const { carrier, user, shop } = query
  const isSet = value => value && value !== '*'
  const $project = {
    year: { $year: '$date' },
    month: { $month: '$date' },
    carrier: '$shipment_infos.carrier',
    user: '$userId',
    shop: '$type'
  }

  const $match = flow([
    _ => (isSet(user) ? Object.assign({}, _, { user: user }) : _),
    _ => (isSet(carrier) ? Object.assign({}, _, { carrier: carrier }) : _),
    _ => (isSet(shop) ? Object.assign({}, _, { shop: shop }) : _)
  ])({
    year: { $gte: 2017 }
  })

  const _id = flow([
    _ => (isSet(carrier) ? Object.assign({}, _, { carrier: '$carrier' }) : _),
    _ => (isSet(user) ? Object.assign({}, _, { user: '$user' }) : _),
    _ => (isSet(shop) ? Object.assign({}, _, { shop: '$shop' }) : _)
  ])({
    year: '$year',
    month: '$month'
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
    date: `${item._id.year}/${item._id.month}`,
    count: item.count
  }))
}

module.exports = fetchShipmentsByMonth
