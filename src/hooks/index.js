const auth = require('feathers-authentication').hooks

module.exports = function (options) {
  return {
    before: {
      all: [
        auth.verifyToken(),
        auth.populateUser(),
        auth.restrictToAuthenticated()
      ]
    }
  }
}
