const authentication = require('feathers-authentication')
const Auth0Strategy = require('passport-auth0').Strategy

function createService (userEndpoint = '/users') {
  return authentication({
    idField: '_id',
    shouldSetupSuccessRoute: false,
    userEndpoint,
    auth0: {
      strategy: Auth0Strategy,
      domain: 'shipandco.auth0.com',
      'clientID': process.env.AUTH0_ID,
      'clientSecret': process.env.AUTH0_SECRET
    },
    token: {
      secret: process.env.TOKEN_SECRET
    }
  })
}

module.exports = createService
