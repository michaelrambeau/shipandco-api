/*
A very simple service to store users who access the application
We need pesistence because the JWT token is somehow linked to a given userId.
We could use a `memory` service but users would have to renew the token everytime the server restarts.
*/

// const memory = require('feathers-memory')
const service = require('feathers-nedb')
const NeDB = require('nedb')

const db = new NeDB({
  filename: './db-data/staff-users.json',
  autoload: true
})

module.exports = service({ Model: db })
// module.exports = memory()
