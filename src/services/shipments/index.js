const MongooseService = require('feathers-mongoose').Service
const Model = require('./Shipment')
const fields = require('./fields')

// Opitimized search by user using `hint` to perform faster `count()` operations
function findByUser (query) {
  const { userId, $skip, $limit } = query
  const limit = parseInt($limit)
  const skip = parseInt($skip)
  const fieldHashMap = fields.reduce(
    (acc, field) => Object.assign({}, acc, {
      [field]: 1
    }),
    {}
  )
  const getShipments = Model
    .find({ userId })
    .sort('-date')
    .skip(skip)
    .limit(limit)
    .select(fieldHashMap)
  const getTotal = Model
    .count({ userId })
    .hint({ userId: 1, date: -1 })
  return Promise.all([getShipments, getTotal])
    .then(([shipments, total]) => ({
      data: shipments,
      limit,
      skip,
      total,
      custom: true
    }))
}

class ShipmentsService extends MongooseService {
  find (params) {
    const $select = fields
    const defaultOptions = { $sort: '-date' };
    const query = Object.assign({}, defaultOptions, params.query, {
      $select
    })
    const updatedParams = Object.assign({}, params, {
      query
    })
    if (params.query.userId) {
      return findByUser(query)
    }
    return super.find(updatedParams)
  }
  get (id, params) {
    return Model.findOne({_id: id}).select({ 'shipment_infos.label': 0 })
    // return super.get(id, params)
  }
}

const service = new ShipmentsService({
  Model,
  paginate: {
    default: 50,
    max: 100
  }
})

// service.after(hooks.remove('shipping_infos.label'));

module.exports = service
