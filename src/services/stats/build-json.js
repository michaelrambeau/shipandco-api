const fs = require('fs-extra')
const path = require('path')

const buildJSON = filename => data => {
  const filepath = path.join(process.cwd(), 'build', filename)
  return fs.outputJSON(filepath, data)
}

module.exports = buildJSON
