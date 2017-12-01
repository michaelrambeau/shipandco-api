const Shipment = require('../shipments/Shipment')

function fetchShipmentsByMonth() {
  const $project = {
    year: { $year: '$date' },
    month: { $month: '$date' }
  }

  const $group = {
    _id: {
      year: '$year',
      month: '$month'
    },
    count: { $sum: 1 }
  }

  const $sort = { _id: 1 }

  const pipeline = [
    // { $match: { state: { $ne: 'void' } } },
    { $match: { date: { $gte: new Date('2017-01-01T00:00:00.000Z') } } },
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

module.exports = fetchShipmentsByMonth
