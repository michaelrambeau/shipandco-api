const oauth2 = require('feathers-authentication-oauth2')
const auth = require('feathers-authentication')
const Auth0Strategy = require('passport-auth0').Strategy
const debug = require('debug')('api')
const path = require('path')

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
      successRedirect: '/auth/success'
      // callbackURL: 'https://shipandco-api-v1.now.sh/auth/auth0/callback'
    })
  )
}

module.exports = createService
