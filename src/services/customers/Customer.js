const mongoose = require('mongoose')

const Schema = mongoose.Schema

const fields = {
  _id: String,
  emails: [{ address: String }],
  profile: {
    name: String
  },
  orders: [
    {
      type: String,
      ref: 'Order'
    }
  ],
  shops: [{
    type: String,
    ref: 'Shop'
  }],
  services: {
    resume: {
      loginTokens: [{
        when: Date
      }]
    }
  }
}

const schema = new Schema(fields, {
  collection: 'users'
})

// schema.virtual('lastLogin').get(function () {
//   return getLastLogin(this)
// })

const model = mongoose.model('Customer', schema)

module.exports = model
