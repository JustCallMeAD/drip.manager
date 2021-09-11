/* eslint-disable */
const max_blocks = 10000

Moralis.Cloud.job('updateDripAccounts', async (request) => {
  const logger = Moralis.Cloud.getLogger()
  const web3 = Moralis.web3ByChain('0x38')
  const dripContract = new web3.eth.Contract(DRIP_TOKEN_ABI, DRIP_TOKEN_ADDRESS)
  let currentBlock = await web3.eth.getBlockNumber()
  const dripStore = await getDripStore()
  const lastBlock = dripStore.get('lastBlock')

  if (currentBlock - lastBlock > max_blocks) {
    currentBlock = lastBlock + max_blocks
  }

  try {
    const accounts = await getAccountsInBlockRange(
      dripContract,
      lastBlock,
      currentBlock
    )

    const DripAccountStat = Moralis.Object.extend('DripAccountStat')
    for (var i = 0; i < accounts.length; i++) {
      const query = new Moralis.Query(DripAccountStat)
      query.equalTo('address', accounts[i])
      const results = await query.find()

      let dripAccountStat
      if (results.length == 0) {
        dripAccountStat = new DripAccountStat()
        dripAccountStat.set('deposit', 0)
        dripAccountStat.set('address', accounts[i])
      } else {
        dripAccountStat = results[0]
      }

      dripAccountStat.set('to_update', true)
      await dripAccountStat.save()
    }

    dripStore.set('lastBlock', currentBlock)
    await dripStore.save()
  } catch (err) {
    logger.error(err.message)
  }

  return {}
})

Moralis.Cloud.job('updateDripAccountsDeposits', async (request) => {
  const logger = Moralis.Cloud.getLogger()
  const web3 = Moralis.web3ByChain('0x38')
  const faucetContract = new web3.eth.Contract(FAUCET_ABI, FAUCET_ADDRESS)

  try {
    logger.info('Searching for all updatable DripAccountStat objects')
    const DripAccountStat = Moralis.Object.extend('DripAccountStat')
    const query = new Moralis.Query(DripAccountStat)
    query.equalTo('to_update', true)
    query.limit(2000)
    const results = await query.find()

    logger.info('Found DripAccountStat objects: ' + results.length)
    for (i = 0; i < results.length; i++) {
      try {
        dripAccountStat = results[i]
        const userInfo = await faucetContract.methods
          .userInfoTotals(dripAccountStat.get('address'))
          .call()

        dripAccountStat.set('deposit_raw', userInfo.total_deposits)
        dripAccountStat.set('deposit', userInfo.total_deposits / 10 ** 18)
        dripAccountStat.set('to_update', false)
        await dripAccountStat.save()
      } catch (e) {
        logger.error('updateDripAccountsDeposits in FOR loop: ' + e.message)
      }
    }
  } catch (err) {
    logger.error('updateDripAccountsDeposits main: ' + err.message)
  }

  return {}
})

Moralis.Cloud.job('updateDripPriceStats', async (request) => {
  const logger = Moralis.Cloud.getLogger()
  const web3 = Moralis.web3ByChain('0x38')
  web3.setProvider('https://speedy-nodes-nyc.moralis.io/ee7441bea90c1d0d1390bf6d/bsc/mainnet/archive')
  
  const DripPriceStat = Moralis.Object.extend('DripPriceStat')

  try {
    const fountainContract = new web3.eth.Contract(
      FOUNTAIN_ABI,
      FOUNTAIN_ADDRESS
    )

    const currentBlock = 8800766 // web3.eth.getBlockNumber()

    // logger.info('Searching for all updatable DripAccountStat objects')
    const query = new Moralis.Query(DripPriceStat)
    query.descending('block_number')
    query.limit(1)
    const results = await query.find()
    var lastBlock = 8790766

    if (results.length == 1) {
      if (results[0].get('block_number') == currentBlock) {
        return {}
      }

      lastBlock = results[0].get('block_number') + 1
    }

    while(lastBlock <= currentBlock){
      const stats = await getFountainStatsAtBlock(fountainContract, lastBlock)
      const block = await web3.eth.getBlock(lastBlock)
      
      const bnbUsdt = await getBnbUsdtPrice(web3, lastBlock)
      logger.info('bnbUsdt: ' + bnbUsdt)
      var priceStat = new DripPriceStat()
      priceStat.set('block_number', lastBlock)
      priceStat.set('bnbDripRatio', stats.bnbDripRatio)
      priceStat.set('timestamp', block.timestamp)
      const date = new Date(block.timestamp * 1000)
      priceStat.set('year', date.getFullYear())
      priceStat.set('month', date.getMonth())
      priceStat.set('day', date.getDate())
      priceStat.set('hour', date.getHours())
      priceStat.set('minute', date.getMinutes())
      priceStat.set('second', date.getSeconds())
      priceStat.set('bnbUsdt', bnbUsdt)
      priceStat.set('dripUsdt', stats.bnbDripRatio * bnbUsdt)

      await priceStat.save()
      lastBlock++
    }
  } catch (err) {
    logger.error('updateDripPriceStats main: ' + err.message)
  }

  return {}
})
