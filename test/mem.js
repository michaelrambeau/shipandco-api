const debug = require('debug')('*')
const mem = require('mem')

const apiFetch = params =>
  new Promise(resolve =>
    setTimeout(() => {
      debug(`${params} OK!`)
      return resolve(`${params} OK!`)
    }, 2000)
  )

const memFetch = mem(apiFetch, { maxAge: 10000 })

async function main() {
  debug('Start')
  await memFetch('1')
  await memFetch('2')
  const x = await memFetch('1')
  debug({ x })
  const y = await memFetch('1')
  debug({ y })
  debug('THE END')
}
main()
