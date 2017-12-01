const Shipment = require('../shipments/Shipment')

function fetchShipmentsByMethod() {
  const $project = {
    'shipment_infos.method': 1,
    'shipment_infos.carrier': 1
  }

  const $group = {
    _id: {
      method: '$shipment_infos.method',
      carrier: '$shipment_infos.carrier'
    },
    count: { $sum: 1 }
  }

  const $sort = { count: -1 }

  const pipeline = [
    { $match: { state: { $ne: 'void' } } },
    { $project },
    { $group },
    { $sort }
  ]

  return Shipment.aggregate(pipeline)
  // .toArray()
  // .reduce(
  //   (acc, item) =>
  //     Object.assign({}, acc, {
  //       [`${item._id.carrier}/${item._id.method}`]: item.count
  //     }),
  //   {}
  // )
}

module.exports = fetchShipmentsByMethod
