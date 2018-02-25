const mongoose = require('mongoose')

const Schema = mongoose.Schema

const fields = {
  _id: String
}

const schema = new Schema(fields, {
  collection: 'carriers'
})

const model = mongoose.model('Carriers', schema)

module.exports = model
