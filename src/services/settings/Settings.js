const mongoose = require('mongoose')

const Schema = mongoose.Schema

const fields = {
  _id: String
}

const schema = new Schema(fields, {
  collection: 'settings'
})

const model = mongoose.model('Settings', schema)

module.exports = model
