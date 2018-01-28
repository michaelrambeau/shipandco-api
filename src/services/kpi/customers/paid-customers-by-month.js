function fetchPaidCustomersByMonth({ Customer }) {
  const $project = {
    date: '$billing.created_at',
    year: { $year: '$billing.created_at' },
    month: { $month: '$billing.created_at' }
  }
  const $match = {
    'billing.created_at': { $exists: 1 }
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

  const pipeline = [{ $match }, { $project }, { $group }, { $sort }]
  return Customer.aggregate(pipeline).then(formatResults)
}

function formatResults(results) {
  return results.map(item => ({
    date: `${item._id.year}/${item._id.month}`,
    count: item.count
  }))
}

module.exports = fetchPaidCustomersByMonth
