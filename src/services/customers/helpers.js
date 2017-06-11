const get = require('lodash.get')

function getLastLogin (user) {
  const tokens = get(user, 'services.resume.loginTokens') || []
  if (tokens.length === 0) return null
  const lastToken = tokens[tokens.length - 1]
  return lastToken.when
}

module.exports = {
  getLastLogin
}
