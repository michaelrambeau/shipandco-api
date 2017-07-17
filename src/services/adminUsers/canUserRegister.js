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

const EMAIL_DOMAIN = 'bentoandco.com'

module.exports = function canUserRegister(hooks) {
  const { data } = hooks
  const { email, name } = data.auth0
  console.log('Checking', email, name)
  if (!isValidEmailAddress(email))
    throw new Error(`Only ${EMAIL_DOMAIN} users can access this application!`)
  console.log('Access allowed', name, email)
}

function isValidEmailAddress(email) {
  const re = new RegExp(`@${EMAIL_DOMAIN}`)
  return re.test(email)
}
