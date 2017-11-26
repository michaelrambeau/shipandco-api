const debug = require('debug')('api')

var Auth0Strategy = require('passport-auth0'),
  passport = require('passport')

function setup({ app }) {
  debug('> setup!')
  var strategy = new Auth0Strategy(
    {
      name: 'auth0',
      secret: process.env.TOKEN_SECRET,
      domain: 'shipandco.auth0.com',
      clientID: process.env.AUTH0_ID,
      clientSecret: process.env.AUTH0_SECRET,
      scope: ['public_profile', 'email'],
      service: 'staff-users',
      entity: 'user',
      successRedirect: '/auth/success',
      callbackURL: '/auth/auth0/callback'
    },
    function(accessToken, refreshToken, extraParams, profile, done) {
      // accessToken is the token to call Auth0 API (not needed in the most cases)
      // extraParams.id_token has the JSON Web Token
      // profile has all the information from the user
      debug('> callback!')
      return done(null, profile)
    }
  )

  passport.use(strategy)
  app.get(
    '/google',
    passport.authenticate('auth0', { connection: 'google-oauth2' }),
    function(req, res) {
      res.redirect('/')
    }
  )
}

module.exports = setup
