const mongoose = require('mongoose')
const Schema = mongoose.Schema

const fields = {
  _id: String,
  customer_name: { type: String, required: true }
}

const ordersSchema = new Schema(fields, {
  collection: 'shipments'
})

const model = mongoose.model('Shipment', ordersSchema)

module.exports = model
