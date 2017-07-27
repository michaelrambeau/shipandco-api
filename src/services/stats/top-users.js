const get = require('lodash.get')

const $lookup = {
  from: 'users',
  localField: '_id.userId',
  foreignField: '_id',
  as: 'users'
}

const formatItem = item => ({
  _id: item._id.userId,
  email: get(item, 'users[0].emails[0].address') || '?',
  lastShipment: item.lastShipment,
  count: item.count
})

function topUsers(Model) {
  const $project = { userId: 1, date: 1 }

  const agg = Model.aggregate([
    { $project },
    {
      $group: {
        _id: { userId: '$userId' },
        lastShipment: { $last: '$date' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    },
    { $lookup }
  ])
  return agg.then(items => items.map(formatItem))
}

module.exports = topUsers
