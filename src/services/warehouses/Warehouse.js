const mongoose = require('mongoose')

const Schema = mongoose.Schema

const fields = {
  _id: String,
  type: String,
  name: String,
  address: Object,
  userId: {
    type: String,
    ref: 'Customer'
  }
}

const schema = new Schema(fields, {
  collection: 'warehouses'
})

const model = mongoose.model('Warehouse', schema)

module.exports = model
