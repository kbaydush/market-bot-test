'use strict'

const pid = process.pid
const service = require('./service.js')
const config = require('./config.js')
const cron = require('node-cron')
const express = require('express')
const app = express()

app.listen(config.port, function () {
  console.log('worker started on port ' + config.port + ' pid: ' + pid)
})

service().init()
console.log('\n')
console.log('Initial Asset Balances: ')

console.log('ETH: ' + config.primaryAssets.ETH)
console.log('USD: ' + config.primaryAssets.USD)
console.log('\n')

// every 5 seconds
cron.schedule('*/5 * * * * *', () => {
  service().init()
})

// every 30 seconds
cron.schedule('*/30 * * * * *', () => {
  console.log('\n')
  console.log('Overall Asset Balances:')

  console.log('ETH: ' + service().getBalances().eth.amount.toFixed(8))
  console.log('USD: ' + service().getBalances().usd.amount.toFixed(2))
  console.log('\n')
})
