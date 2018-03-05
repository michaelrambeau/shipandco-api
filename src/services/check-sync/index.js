const Shop = require('../shops/Shop')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const shopTypes = [
  'amazon',
  'base',
  'ebay',
  'magento',
  'nextengine',
  'prestashop',
  'rakuten'
]

// Exclude shops whose token is no more valid!
const enabledRules = {
  // ebay: shop => {
  //   const now = new Date()
  //   return shop.tokenExpiration > now
  // }
}

const isSyncEnabled = shop => {
  const fn = enabledRules[shop.type]
  return fn ? fn(shop) : true
}

class CheckSyncService {
  find() {
    const query = {
      'meta.type': {
        $in: shopTypes
      },
      'meta.state': { $nin: ['pending', 'deleted'] }
    }
    return Shop.find(query)
      .lean()
      .then(processShops)
      .catch(e => {
        console.error('Error!', e)
        return e.message
      })
  }
}

function processShops(shops) {
  const now = new Date()
  const minutesFromNow = date => parseInt((now - date) / 1000 / 60)
  const lastSyncByShopType = shops
    .filter(isSyncEnabled)
    .filter(shop => !!shop.sync)
    .reduce((acc, shop) => {
      const { type } = shop.meta
      const { synced_at } = shop.sync
      const last = minutesFromNow(synced_at)
      const oldest = acc[type] ? Math.max(last, acc[type]) : last
      return Object.assign({}, acc, {
        [type]: oldest
      })
    }, {})
  return lastSyncByShopType
}

const service = new CheckSyncService()

module.exports = service
