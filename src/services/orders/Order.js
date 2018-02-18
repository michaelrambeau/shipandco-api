const mongoose = require('mongoose')
const Schema = mongoose.Schema

const fields = {
  _id: String
}

const ordersSchema = new Schema(fields, {
  collection: 'orders'
})

const ordersModel = mongoose.model('Order', ordersSchema)

module.exports = ordersModel
