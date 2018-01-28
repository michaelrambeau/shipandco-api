function fetchCustomersByMonth({ Customer }) {
  const $project = {
    date: '$createdAt',
    year: { $year: '$createdAt' },
    month: { $month: '$createdAt' },
    billing: '$billing'
  }

  const _id = {
    year: '$year',
    month: '$month'
  }

  const $group = {
    _id,
    count: { $sum: 1 }
  }

  const $sort = { _id: 1 }

  const pipeline = [
    // { $match: { state: { $ne: 'void' } } },
    { $project },
    // { $match },
    { $group },
    { $sort }
  ]
  return Customer.aggregate(pipeline).then(formatResults)
}

function formatResults(results) {
  return results.map(item => ({
    date: `${item._id.year}/${item._id.month}`,
    count: item.count
  }))
}

module.exports = fetchCustomersByMonth
