/* globals feathers */

window.authenticate = function() {
  console.log('Auth process...')
  const host = ''
  const app = feathers()
    .configure(feathers.rest(host).fetch(window.fetch))
    .configure(feathers.hooks())
    .configure(
      feathers.authentication({
        storage: window.localStorage,
        cookie: 'feathers-jwt'
      })
    )

  // authenticate using your JWT that was passed in the short lived cookie
  app
    // .authenticate({ strategy: 'memory' })
    .authenticate()
    .then(function(result) {
      console.info('Authenticated!', result)
    })
    .catch(function(error) {
      console.error('Error authenticating!', error)
    })

  window.app = app
}
