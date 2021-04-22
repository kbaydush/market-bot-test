const Big = require('big.js')
async function asyncForEach (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

async function randomNumber (max) {
  return Math.random() * max
}

async function randomInRange (min, max) {
  const n = Math.random() * (max - min + 0.1) + min
  return n > max ? randomInRange(min, max) : n
}

async function randomPriceFilter (price) {
  // less or more with 5%
  const part = price.div(20)
  const from = price.minus(part)
  const to = price.plus(part)
  const rounded = new Big(await randomInRange(from.toNumber(), to.toNumber())).toFixed(2)
  return new Big(rounded)
}

async function randomAmountFilter (max) {
  // random with 5%
  const to = max.div(20)
  const random = new Big(await randomNumber(to.toFixed(2))).toFixed(2)
  return new Big(random)
}

async function bestPriceFilter (orders) {
  let bid = new Big(0)
  let ask = 0

  await asyncForEach(orders, order => {
    const big = new Big(order[0])
    if (big.gt(bid)) {
      bid = big
    } else if (big.gt(0) && (big.lt(ask) || !ask)) {
      ask = big
    }
  })
  return {
    ask,
    bid
  }
}

module.exports = { bestPriceFilter, randomAmountFilter, randomPriceFilter }
