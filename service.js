'use strict'
const utils = require('./utils.js')
const request = require('./request.js')
const config = require('./config.js')
const Big = require('big.js')
const assets = { eth: { amount: new Big(config.primaryAssets.ETH) }, usd: { amount: new Big(config.primaryAssets.USD) } }

module.exports = function () {
  return {
    init: async () => {
      const params = {
        Symbol: 'tETHUSD',
        Precision: 'P0'
      }
      request().getMarketdataBook(params).then(async function (orders) {
        const bestPrices = await utils.bestPriceFilter(orders)
        console.log('\n--- 5 seconds iteration ---\n')
        for (let i = 0; i < config.countOfOrders; i++) {
          const amount = { usd: await utils.randomAmountFilter(assets.usd.amount), eth: await utils.randomAmountFilter(assets.eth.amount) }
          const order = { bid: await utils.randomPriceFilter(bestPrices.bid), ask: await utils.randomPriceFilter(bestPrices.ask) }
          console.log('PLACE BID @ PRICE: ' + order.bid + ' AMOUNT (ETH: ' + amount.eth + ' USD: ' + amount.usd + ')')
          console.log('PLACE ASK @ PRICE: ' + order.ask + ' AMOUNT (ETH: ' + amount.eth + ' USD: ' + amount.usd + ')')

          if (order.bid.gt(bestPrices.bid)) {
            // sold
            assets.usd.amount = assets.usd.amount.minus(amount.usd)
            assets.eth.amount = assets.eth.amount.minus(amount.eth)
            console.info('FILLED BID @ PRICE: ' + order.bid + ' AMOUNT (ETH: ' + amount.eth + ' USD: ' + amount.usd)
          }

          if (order.ask.lt(bestPrices.ask)) {
            // bought
            assets.usd.amount = assets.usd.amount.plus(amount.usd)
            assets.eth.amount = assets.eth.amount.plus(amount.eth)
            console.info('FILLED ASK @ PRICE: ' + order.ask + ' AMOUNT (ETH: ' + amount.eth + ' USD: ' + amount.usd)
          }
        }
      }).catch(function (error) {
        throw error.message
      })
    },

    getBalances: () => {
      return assets
    }
  }
}
