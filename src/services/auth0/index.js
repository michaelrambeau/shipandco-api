const oauth2 = require('feathers-authentication-oauth2')
const auth = require('feathers-authentication')
const Auth0Strategy = require('passport-auth0').Strategy
const debug = require('debug')('api')
const path = require('path')
const get = require('lodash.get')

const WEB_CLIENT_COOKIE = 'web-client-url'

function createService({ app }) {
  // Add a middleware to write in a cookie where the user comes from
  // This cookie will be used later to redirect the user to the single-page application.
  app.get('/auth/auth0', (req, res, next) => {
    const { origin } = req.query
    if (origin) {
      res.cookie(WEB_CLIENT_COOKIE, origin)
    } else {
      res.clearCookie(WEB_CLIENT_COOKIE)
    }
    next()
  })
  // Route called after a successful login
  // Redirect the user to the single-page application "forwarding" the auth token
  app.get('/auth/success', (req, res) => {
    const origin = req.cookies && req.cookies[WEB_CLIENT_COOKIE]
    debug(
      'Auth Success!',
      req.cookies,
      req.query,
      req.params,
      req.url,
      req.user
    )
    if (origin) {
      //  if there is a cookie that contains the URL source, redirect the user to this URL
      const token = req.cookies['feathers-jwt']
      const redirectUrl = `${origin}/auth0.html#${token}`
      res.redirect(redirectUrl)
    } else {
      // otherwise send the static page on the same domain.
      res.sendFile(path.resolve(process.cwd(), 'public', 'success.html'))
    }
  })
  // end-point used by Feasther legacy client to check if a user is authenticated
  app.post('/auth/token', async (req, res) => {
    try {
      const token = req.body.token
      debug('Verifying the token', token)
      const secret = app.get('auth').secret
      const result = await app.passport.verifyJWT(token, { secret })
      debug('Token Verification result', result)
      const { userId } = result
      if (!userId && userId !== 0) throw new Error('No user id!')
      const user = await app.service('staff-users').get(userId)
      if (!user) throw new Error(`No user found "${userId}"`)
      debug('User found', user)
      const json = {
        token,
        data: {
          auth0Id: user.auth0Id,
          auth0: {
            email: get(user, 'auth0.profile.emails[0].value'),
            name: get(user, 'auth0.profile.displayName')
          }
        }
      }
      res.send(json)
    } catch (err) {
      res.status(401).send({ message: err.message })
    }
  })
  app.configure(
    oauth2({
      name: 'auth0',
      secret: process.env.TOKEN_SECRET,
      Strategy: Auth0Strategy,
      domain: 'shipandco.auth0.com',
      clientID: process.env.AUTH0_ID,
      clientSecret: process.env.AUTH0_SECRET,
      scope: ['public_profile', 'email'],
      service: 'staff-users',
      entity: 'user',
      successRedirect: '/auth/success',
      callbackURL: '/auth/auth0/callback',
      connection: 'google-oauth2' // auth0 settings to avoid the provider selection step
    })
  )

  // Needed to make `userId` available in `verifyJWT` response
  app.service('authentication').hooks({
    before: {
      create: [auth.hooks.authenticate(['jwt', 'staff-users'])],
      remove: [auth.hooks.authenticate('jwt')]
    }
  })
}

module.exports = createService
