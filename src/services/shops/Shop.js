const mongoose = require('mongoose')

const Schema = mongoose.Schema

const fields = {
  _id: String
}

const schema = new Schema(fields, {
  collection: 'shops'
})

const model = mongoose.model('Shop', schema)

module.exports = model
