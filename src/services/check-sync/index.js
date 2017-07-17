const Shop = require('../shops/Shop')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const shopTypes = [
  'amazon',
  'base',
  'ebay',
  'magento1',
  'magento2',
  'nextengine',
  'prestashop15',
  'rakuten'
]

class CheckSyncService {
  find(params) {
    const query = {
      type: {
        $in: shopTypes
      }
    }
    return Shop.find(query)
      .select({ name: 1, type: 1, lastSync: 1 })
      .then(shops => processShops(shops))
      .catch(e => {
        console.error('Error!', e)
        return e.message
      })
  }
}

function processShops(shops) {
  const now = new Date()
  const minutesFromNow = date => parseInt((now - date) / 1000 / 60)
  const lastSyncByShopType = shops.reduce((acc, shop) => {
    const { lastSync, type } = shop
    const last = minutesFromNow(lastSync)
    const oldest = acc[type] ? Math.max(last, acc[type]) : last
    return Object.assign({}, acc, {
      [type]: oldest
    })
  }, {})
  return lastSyncByShopType
}

const service = new CheckSyncService()

module.exports = service
