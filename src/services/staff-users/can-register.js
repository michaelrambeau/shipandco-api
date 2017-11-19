const get = require('lodash.get')
/*
Example of `data` object:
{ auth0Id: 'google-oauth2|**************',
  auth0:
   { email: 'michael@bentoandco.com',
     email_verified: true,
     name: 'Michael Rambeau',
     given_name: 'Michael',
     family_name: 'Rambeau',
     picture: 'https://lh5.googleusercontent.com/-FJVKv6lUo38/AAAAAAAAAAI/AAAAAAAAAAk/KOeF-rvKgnM/photo.jpg',
     locale: 'en',
     clientID: '*******************',
     updated_at: '2016-11-02T23:51:50.607Z',
     user_id: 'google-oauth2|************',
     nickname: 'michael',
     identities: [ [Object] ],
     created_at: '2016-10-22T01:24:36.617Z',
     sub: 'google-oauth2|*************',
     accessToken: '****************' } }
*/

const debug = require('debug')('api')
const EMAIL_DOMAIN = 'bentoandco.com'

module.exports = function canUserRegister(hooks) {
  const { data } = hooks
  const email = get(data, 'auth0.profile.emails[0].value')
  debug('Auth0', data.auth0.profile)
  debug('Checking', email)
  if (!isValidEmailAddress(email))
    throw new Error(`Only ${EMAIL_DOMAIN} users can access this application!`)
  debug('Access allowed', email)
}

function isValidEmailAddress(email) {
  const re = new RegExp(`@${EMAIL_DOMAIN}`)
  return re.test(email)
}
