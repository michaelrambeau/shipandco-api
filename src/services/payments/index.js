const Stripe = require('stripe')

const token = process.env.STRIPE_TOKEN_PRODUCTION
const stripe = Stripe(token)

class PaymentService {
  find(params) {
    const { limit, customer } = params.query
    const options = {
      limit: limit || 10
    }
    if (customer) options.customer = customer
    return stripe.charges.list(options).then(result =>
      result.data.map(charge => ({
        date: new Date(charge.created * 1000),
        amount: charge.amount,
        customer: charge.customer
      }))
    )
  }
}

const service = new PaymentService()

module.exports = service
