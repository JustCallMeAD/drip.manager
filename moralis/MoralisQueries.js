/* eslint-disable */

Moralis.Cloud.define('queryDeposits', async (request) => {
  const logger = Moralis.Cloud.getLogger()
  const ranges = request.params.ranges

  const response = { ranges: ranges, results: [] }

  for (i = 0; i < ranges.length; i++) {
    const query = new Moralis.Query('DripAccountStat')
    query.greaterThanOrEqualTo('deposit', ranges[i])

    if (i != ranges.length - 1) {
      query.lessThan('deposit', ranges[i + 1])
    }
    response.results[i] = await query.count()
  }

  return response
})

Moralis.Cloud.job('queryAccounts', async (request) => {
  const logger = Moralis.Cloud.getLogger()
  const query = new Moralis.Query('DripTransfers')

  const result = await query.aggregate([
    // {
    //   group: {
    //     objectId: '$from',
    //     firstIncounter: { $min: '$block_timestamp' }
    //   }
    // }
    //   ,
    {
      group: {
        objectId: {
          the_type: {$type: '$block_timestamp'}
        },
        nbOfPlayers: { $max: '$block_timestamp' },

      }
    }
  ])

  logger.info('result: ' + JSON.stringify(result))

  return ''
})
