/* eslint-disable */

Moralis.Cloud.define('queryDeposits', async (request) => {
  const logger = Moralis.Cloud.getLogger()
  const ranges = request.params.ranges

  const response = { ranges: ranges, results: [] }
  let totalDistinctRange = 0
  for (i = 0; i < ranges.length; i++) {
    const query = new Moralis.Query('DripAccountStat')
    query.greaterThanOrEqualTo('deposit', ranges[i])

    if (i != ranges.length - 1) {
      query.lessThan('deposit', ranges[i + 1])
    }
    response.results[i] = await query.count()
    totalDistinctRange += response.results[i]
  }

  response.totalDistinctRange = totalDistinctRange
  return response
})

// request.params.address = BSC address of the player to query
Moralis.Cloud.define('queryFaucetGlobalUserInfo', async (request) => {
  if (!request.params.address) {
    return {}
  }

  const logger = Moralis.Cloud.getLogger()
  const web3 = Moralis.web3ByChain('0x38')
  const faucetContract = new web3.eth.Contract(FAUCET_ABI, FAUCET_ADDRESS)
  const userInfoTotals = await faucetContract.methods
    .userInfoTotals(request.params.address)
    .call()
  const userInfo = await faucetContract.methods
    .userInfo(request.params.address)
    .call()
  const users = await faucetContract.methods
    .users(request.params.address)
    .call()
  const maxPayouts = await faucetContract.methods
    .payoutOf(request.params.address)
    .call()
  const claimsAvailable = await faucetContract.methods
    .claimsAvailable(request.params.address)
    .call()
  return {
    ...userInfoTotals,
    ...userInfo,
    max_payouts: maxPayouts,
    claim_available: claimsAvailable,
    ...users
  }
})

Moralis.Cloud.job('queryDripPriceStats', async (request) => {
  const logger = Moralis.Cloud.getLogger()
  const ranges = request.params.ranges

  const response = {}

  const pipeline = [
    {
      group: {
        objectId: {
          year: '$year',
          month: '$month',
          day: '$day',
          hour: '$hour'
          // ,          minute: '$minute'
        },
        bnbDripRatio: { $avg: '$bnbDripRatio' },
        high: { $max: '$bnbDripRatio' },
        low: { $min: '$bnbDripRatio' },
        open: { $first: '$bnbDripRatio' },
        close: { $last: '$bnbDripRatio' }
      }
    }
  ]

  const query = new Moralis.Query('DripPriceStat')

  query
    .aggregate(pipeline)
    .then(function (results) {
      logger.info('results is: ' + JSON.stringify(results))
    })
    .catch(function (error) {
      logger.error(error)
    })

  // let totalDistinctRange = 0
  // for (i = 0; i < ranges.length; i++) {
  //   query.greaterThanOrEqualTo('deposit', ranges[i])

  //   if (i != ranges.length - 1) {
  //     query.lessThan('deposit', ranges[i + 1])
  //   }
  //   response.results[i] = await query.count()
  //   totalDistinctRange += response.results[i]
  // }

  // response.totalDistinctRange = totalDistinctRange
  return 'testing the function'
})
