const flow = require('lodash.flow')
// const debug = require('debug')('api')

function fetchShipmentsByMethod({ Shipment, query }) {
  const { carrier, user, shop } = query
  const isSet = value => value && value !== '*'
  const $project = {
    year: { $year: '$date' },
    method: '$shipment_infos.method',
    carrier: '$shipment_infos.carrier',
    user: '$userId',
    shop: '$type'
  }

  const _id = flow([
    _ => (isSet(carrier) ? Object.assign({}, _, { carrier: '$carrier' }) : _),
    _ => (isSet(user) ? Object.assign({}, _, { user: '$user' }) : _),
    _ => (isSet(shop) ? Object.assign({}, _, { shop: '$shop' }) : _)
  ])({
    carrier: '$carrier',
    method: '$method'
  })

  const $group = {
    _id,
    count: { $sum: 1 }
  }

  const $sort = { count: -1 }

  const $match = flow([
    _ => (isSet(user) ? Object.assign({}, _, { user: user }) : _),
    _ => (isSet(carrier) ? Object.assign({}, _, { carrier: carrier }) : _),
    _ => (isSet(shop) ? Object.assign({}, _, { shop: shop }) : _)
  ])({
    year: { $gte: 2017 }
  })

  const pipeline = [{ $project }, { $match }, { $group }, { $sort }]

  return Shipment.aggregate(pipeline).then(formatResults)
}

function formatResults(results) {
  return results.map(item => ({
    carrier: item._id.carrier,
    method: item._id.method,
    count: item.count
  }))
}

module.exports = fetchShipmentsByMethod
