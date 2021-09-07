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
        const userInfo = await faucetContract.methods.userInfoTotals(dripAccountStat.get('address')).call()
       
        dripAccountStat.set('deposit_raw', userInfo.total_deposits)
        dripAccountStat.set('deposit', userInfo.total_deposits / (10 ** 18))
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






