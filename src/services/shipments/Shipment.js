const mongoose = require('mongoose')
const Schema = mongoose.Schema

const fields = {
  _id: String,
  customer_name: { type: String, required: true }
}

const schema = new Schema(fields, {
  collection: 'shipments'
})

schema.index({ 'shipment_infos.carrier': 1, date: -1 })

const model = mongoose.model('Shipment', schema)

module.exports = model
