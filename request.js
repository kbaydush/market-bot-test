
const requestPromise = require('request-promise')
const config = require('./config.js')

module.exports = function () {
  return {
    getMarketdataBook: async (params) => {
      const url = config.API_URL + '/book/' + params.Symbol + '/' + params.Precision
      const options = {
        resolveWithFullResponse: true,
        uri: url
      }
      try {
        const res = await requestPromise(options)

        return JSON.parse(res.body)
      } catch (error) {
        throw error.message
      }
    }
  }
}
