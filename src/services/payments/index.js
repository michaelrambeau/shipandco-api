const Stripe = require('stripe')
const get = require('lodash.get')
const debug = require('debug')('api')

const Customer = require('../customers/Customer')

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
  id: invoice.date,
  date: new Date(invoice.date * 1000),
  amount: invoice.amount_due,
  customer: invoice.customer,
  closed: invoice.closed,
  itemsCount: invoice.lines.total_count,
  items: invoice.lines.data.map(formatLineItem)
})

class PaymentService {
  constructor({ token }) {
    this.stripe = new Stripe(token)
  }
  async find(params) {
    const { limit, userId } = params.query
    const stripeCustomerId = userId && (await getStripeCustomerId(userId))
    if (!stripeCustomerId) return { total: 0, data: [] }
    debug('Fetch invoices for customer', stripeCustomerId)
    const options = {
      limit: limit || 10
    }
    if (stripeCustomerId) options.customer = stripeCustomerId
    return this.stripe.invoices.list(options).then(result => {
      const invoices = result.data
      debug('Invoices found', invoices.length)
      return { total: invoices.length, data: invoices.map(formatInvoice) }
    })
  }
}

function createService(token) {
  const service = new PaymentService({ token })
  return service
}

module.exports = createService
