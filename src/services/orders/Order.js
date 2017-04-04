const mongoose = require('mongoose')
const Schema = mongoose.Schema

const fields = {
  _id: String,
  customerName: { type: String, required: true },
  shipmentId: String,
  state: String,
  shopId: String
}

const ordersSchema = new Schema(fields, {
  collection: 'userOrders'
})

const ordersModel = mongoose.model('Order', ordersSchema)

module.exports = ordersModel
