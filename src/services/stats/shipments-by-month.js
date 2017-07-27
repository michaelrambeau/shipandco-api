const formatItem = item => {
  return {
    date: new Date(item._id.year, item._id.month - 1, 1),
    count: item.count
  }
}

function byMonth(Model) {
  const $project = { year: { $year: '$date' }, month: { $month: '$date' } }

  const agg = Model.aggregate([
    { $project },
    {
      $group: {
        _id: { year: '$year', month: '$month' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    }
  ])
  return agg.then(items => items.map(formatItem))
}

module.exports = byMonth
