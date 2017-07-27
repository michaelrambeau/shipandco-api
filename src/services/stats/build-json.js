const debug = require('debug')('api')
const fs = require('fs-extra')
const path = require('path')

const buildJSON = filename => data => {
  debug('Building...', filename)
  const filepath = path.join(process.cwd(), 'build', filename)
  return fs.outputJSON(filepath, data).then(() => data)
}

module.exports = buildJSON
