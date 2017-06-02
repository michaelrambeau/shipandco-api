const MongooseService = require('feathers-mongoose').Service
const Model = require('./Shipment')
const fields = require('./fields')

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
    const fieldHashMap = fields.reduce(
        (acc, field) => Object.assign({}, acc, {
          [field]: 1
        }),
        {}
      )
    console.log('Fields', fieldHashMap)
    // return Model
      // .count({ userId: params.query.userId })
    return super.find(updatedParams)
    // return Model
    //   .find({ userId: params.query.userId })
    //   .sort(params.query.$sort)
    //   .skip(parseInt(params.query.$skip))
    //   .limit(parseInt(params.query.$limit))
    //   .select(fieldHashMap)
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
