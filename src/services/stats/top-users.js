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
  const $project = { 'meta.user_id': 1, 'meta.created_at': 1 }

  const agg = Model.aggregate([
    { $project },
    {
      $group: {
        _id: { userId: '$meta.user_id' },
        lastShipment: { $last: '$meta.created_at' },
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
