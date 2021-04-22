'use strict'
require('dotenv').config()

const config = {

  port: process.env.PORT,

  API_URL: process.env.API_URL + process.env.API_VERSION,

  primaryAssets: {
    ETH: process.env.PRIMARY_ETH_BALANCE,
    USD: process.env.PRIMARY_USD_BALANCE
  },

  countOfOrders: process.env.ORDERS_INTERVAL

}

module.exports = config
