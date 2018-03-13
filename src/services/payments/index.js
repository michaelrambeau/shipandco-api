const Stripe = require('stripe')
const get = require('lodash.get')
const debug = require('debug')('api')
const mem = require('mem')

const Customer = require('../customers/Customer')
const memOptions = { maxAge: 50 * 60 * 1000 } // 5 minutes until the cache expires (in ms)

const memoize = fn => mem(fn, memOptions)

const getStripeCustomerId = _id => {
  debug('Lookup Stripe customer id from', _id)
  const fieldPath = 'billing.customer_id'
  return Customer.findOne({ _id }).then(result => {
    if (!result) return null
    return get(result.toObject(), fieldPath)
  })
}

const formatLineItem = line => ({
  id: line.id,
  amount: line.amount,
  description: line.description
})

const formatInvoice = invoice => ({
  id: invoice.id,
  date: new Date(invoice.date * 1000),
  amount: invoice.amount_due,
  customer: invoice.customer,
  closed: invoice.closed,
  itemsCount: invoice.lines.total_count,
  items: invoice.lines.data.map(formatLineItem)
})

async function fetchInvoicesByUser({ stripe, userId, limit }) {
  const stripeCustomerId = userId && (await getStripeCustomerId(userId))
  if (!stripeCustomerId) return { total: 0, data: [] }
  debug('Fetch invoices by customer', stripeCustomerId)
  const options = {
    limit: limit || 10,
    customer: stripeCustomerId
  }
  return stripe.invoices.list(options).then(result => {
    const invoices = result.data
    debug('Invoices found', invoices.length)
    return {
      total: invoices.length,
      data: invoices.map(formatInvoice)
    }
  })
}

function fetchAllPaidUsers() {
  const query = { 'billing.customer_id': { $exists: 1 } }
  return Customer.find(query).lean()
}

const addUser = users => invoice => {
  const foundUser = users.find(
    user => user.billing.customer_id === invoice.customer
  )
  return foundUser
    ? Object.assign({}, invoice, {
        user: {
          _id: foundUser._id,
          emails: foundUser.emails,
          contact: foundUser.contact,
          billing: foundUser.billing
        }
      })
    : invoice
}

async function fetchAllInvoices({ stripe, limit }) {
  const options = {
    limit: limit || 50,
    billing: 'charge_automatically'
  }
  const users = await fetchAllPaidUsers()
  debug('Fetch all invoices')
  return stripe.invoices.list(options).then(result => {
    const invoices = result.data
    debug('Invoices found', invoices.length)
    const data = invoices
      .map(formatInvoice)
      // .filter(invoice => invoice.amount > 0)
      .map(addUser(users))
      .filter(invoice => !!invoice.user)
    return {
      total: data.length,
      data
    }
  })
}

class PaymentService {
  constructor({ token }) {
    this.stripe = new Stripe(token)
  }
  async find(params) {
    const { stripe } = this
    const { limit, userId } = params.query
    if (userId) {
      return fetchInvoicesByUser({ stripe: this.stripe, userId, limit })
    }
    // const memoizedFetchAllInvoices = memoize(() =>
    //   Promise.resolve({ msg: 'OK' })
    // )
    const fetchAll = () => fetchAllInvoices({ stripe, limit })
    const memoized = memoize(fetchAll)
    // console.log(memoizedFetchAllInvoices)
    return memoized()
    // return memoizedFetchAllInvoices()
  }
}

function createService(token) {
  const service = new PaymentService({ token })
  return service
}

module.exports = createService
