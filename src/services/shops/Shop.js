const mongoose = require('mongoose')

const Schema = mongoose.Schema

const fields = {
  _id: String,
  type: String,
  name: String,
  created_at: Date,
  tokenExpiration: Date,
  lastSync: Date,
  settings: Object,
  userId: {
    type: String,
    ref: 'Customer'
  }
}

const schema = new Schema(fields, {
  collection: 'shops'
})

const model = mongoose.model('Shop', schema)

module.exports = model
