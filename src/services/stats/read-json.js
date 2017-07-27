const debug = require('debug')('api')
const fs = require('fs-extra')
const path = require('path')

const readJSON = filename => {
  debug('Reading...', filename)
  const filepath = path.join(process.cwd(), 'build', filename)
  return fs.readJSON(filepath).catch(err => {
    console.error(err) // eslint-disable-no-console
    return []
  })
}

module.exports = readJSON
