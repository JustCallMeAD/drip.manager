/* eslint-disable */
const max_blocks = 10000

Moralis.Cloud.job('updateDripAccounts', async (request) => {
  const logger = Moralis.Cloud.getLogger()
  const web3 = Moralis.web3ByChain('0x38')
  // const faucetContract = new web3.eth.Contract(FAUCET_ABI, FAUCET_ADDRESS)
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
        //logger.info("Current DripAccountStat: " + JSON.stringify(dripAccountStat))
        const userInfo = await getUserInfo(
          faucetContract,
          dripAccountStat.get('address')
        )
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

Moralis.Cloud.job('update', async (request) => {
  const DripAccountStat = Moralis.Object.extend('DripAccountStat')
  const query = new Moralis.Query(DripAccountStat)
  query.limit(2000)
  const results = await query.find()

  logger.info('Found DripAccountStat objects: ' + results.length)
  for (i = 0; i < results.length; i++) {
    try {
      dripAccountStat = results[i]
      dripAccountStat.set('deposit', 0)
      dripAccountStat.set('to_update', true)
      await dripAccountStat.save()
    } catch (e) {
      logger.error('updateDripAccountsDeposits in FOR loop: ' + e.message)
    }
  }

  return {}
})

const getDripStore = async () => {
  const firstBlock = 6736460
  const DripStore = Moralis.Object.extend('DripStore')
  const query = new Moralis.Query(DripStore)

  const results = await query.find()
  if (results.length == 0) {
    const dripStore = new DripStore()
    dripStore.set('lastBlock', firstBlock)
    return await dripStore.save()
  }

  return results[0]
}

const getUserInfo = (contract, userAddr) => {
  return contract.methods.userInfoTotals(userAddr).call()
}

const FAUCET_ADDRESS = '0xFFE811714ab35360b67eE195acE7C10D93f89D8C'
const FAUCET_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_src',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_dest',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_deposits',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_payouts',
        type: 'uint256'
      }
    ],
    name: 'BalanceTransfer',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'addr',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'beneficiary',
        type: 'address'
      }
    ],
    name: 'BeneficiaryUpdate',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'addr',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256'
      }
    ],
    name: 'Checkin',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'addr',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'DirectPayout',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'addr',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256'
      }
    ],
    name: 'HeartBeat',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'addr',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'interval',
        type: 'uint256'
      }
    ],
    name: 'HeartBeatIntervalUpdate',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'addr',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'referrals',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'total_deposits',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'total_payouts',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'total_structure',
        type: 'uint256'
      }
    ],
    name: 'Leaderboard',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'addr',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'LimitReached',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'addr',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'manager',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256'
      }
    ],
    name: 'ManagerUpdate',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'addr',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'MatchPayout',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256'
      }
    ],
    name: 'NewAirdrop',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'addr',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'NewDeposit',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'addr',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'upline',
        type: 'address'
      }
    ],
    name: 'Upline',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'addr',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'Withdraw',
    type: 'event'
  },
  {
    stateMutability: 'payable',
    type: 'fallback'
  },
  {
    inputs: [],
    name: 'CompoundTax',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'ExitTax',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'MAX_UINT',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'UserAddresses',
        type: 'address[]'
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'upline',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'referrals',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'total_structure',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'direct_bonus',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'match_bonus',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'deposits',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'deposit_time',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'payouts',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'rolls',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'ref_claim_pos',
            type: 'uint256'
          }
        ],
        internalType: 'struct Faucet.User[]',
        name: 'newUserData',
        type: 'tuple[]'
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'airdrops',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'airdrops_received',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'last_airdrop',
            type: 'uint256'
          }
        ],
        internalType: 'struct Faucet.Airdrop[]',
        name: 'newUserAirdropData',
        type: 'tuple[]'
      }
    ],
    name: 'addUsers',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_to',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256'
      }
    ],
    name: 'airdrop',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    name: 'airdrops',
    outputs: [
      {
        internalType: 'uint256',
        name: 'airdrops',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'airdrops_received',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'last_airdrop',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_addr',
        type: 'address'
      }
    ],
    name: 'balanceLevel',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'checkin',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'claim',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_addr',
        type: 'address'
      }
    ],
    name: 'claimsAvailable',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'contractInfo',
    outputs: [
      {
        internalType: 'uint256',
        name: '_total_users',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_total_deposited',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_total_withdraw',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_total_bnb',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_total_txs',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_total_airdrops',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_addr',
        type: 'address'
      }
    ],
    name: 'creditsAndDebits',
    outputs: [
      {
        internalType: 'uint256',
        name: '_credits',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_debits',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    name: 'custody',
    outputs: [
      {
        internalType: 'address',
        name: 'manager',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'beneficiary',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'last_heartbeat',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'last_checkin',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'heartbeat_interval',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_upline',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256'
      }
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'deposit_bracket_size',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'dripVaultAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_addr',
        type: 'address'
      }
    ],
    name: 'getCustody',
    outputs: [
      {
        internalType: 'address',
        name: '_beneficiary',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_heartbeat_interval',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: '_manager',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_mintAddress',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '_BR34PTokenAddress',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '_dripTokenAddress',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '_vaultAddress',
        type: 'address'
      }
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_addr',
        type: 'address'
      },
      {
        internalType: 'uint8',
        name: '_level',
        type: 'uint8'
      }
    ],
    name: 'isBalanceCovered',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_addr',
        type: 'address'
      }
    ],
    name: 'isNetPositive',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_addr',
        type: 'address'
      }
    ],
    name: 'lastActivity',
    outputs: [
      {
        internalType: 'uint256',
        name: '_heartbeat',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_lapsed_heartbeat',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_checkin',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_lapsed_checkin',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256'
      }
    ],
    name: 'maxPayoutOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [],
    name: 'max_payout_cap',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_addr',
        type: 'address'
      }
    ],
    name: 'payoutOf',
    outputs: [
      {
        internalType: 'uint256',
        name: 'payout',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'max_payout',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'net_payout',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'sustainability_fee',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    name: 'ref_balances',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'roll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'newTotalAirdrop',
        type: 'uint256'
      }
    ],
    name: 'setTotalAirdrops',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'newTotalBNB',
        type: 'uint256'
      }
    ],
    name: 'setTotalBNB',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'newTotalDeposits',
        type: 'uint256'
      }
    ],
    name: 'setTotalDeposits',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'newTotalTX',
        type: 'uint256'
      }
    ],
    name: 'setTotalTX',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'newTotalUsers',
        type: 'uint256'
      }
    ],
    name: 'setTotalUsers',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'newTotalWithdraw',
        type: 'uint256'
      }
    ],
    name: 'setTotalWithdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_addr',
        type: 'address'
      }
    ],
    name: 'sustainabilityFee',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'total_airdrops',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'total_bnb',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'total_deposited',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'total_txs',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'total_users',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'total_withdraw',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_newCompoundTax',
        type: 'uint256'
      }
    ],
    name: 'updateCompoundTax',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_newBracketSize',
        type: 'uint256'
      }
    ],
    name: 'updateDepositBracketSize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_newExitTax',
        type: 'uint256'
      }
    ],
    name: 'updateExitTax',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256[]',
        name: '_newRefBalances',
        type: 'uint256[]'
      }
    ],
    name: 'updateHoldRequirements',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_newInitialDeposit',
        type: 'uint256'
      }
    ],
    name: 'updateInitialDeposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_newPayoutCap',
        type: 'uint256'
      }
    ],
    name: 'updateMaxPayoutCap',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_newPayoutRate',
        type: 'uint256'
      }
    ],
    name: 'updatePayoutRate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_newRefBonus',
        type: 'uint256'
      }
    ],
    name: 'updateRefBonus',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_newRefDepth',
        type: 'uint256'
      }
    ],
    name: 'updateRefDepth',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_addr',
        type: 'address'
      }
    ],
    name: 'userInfo',
    outputs: [
      {
        internalType: 'address',
        name: 'upline',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'deposit_time',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'deposits',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'payouts',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'direct_bonus',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'match_bonus',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'last_airdrop',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_addr',
        type: 'address'
      }
    ],
    name: 'userInfoTotals',
    outputs: [
      {
        internalType: 'uint256',
        name: 'referrals',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'total_deposits',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'total_payouts',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'total_structure',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'airdrops_total',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'airdrops_received',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    name: 'users',
    outputs: [
      {
        internalType: 'address',
        name: 'upline',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'referrals',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'total_structure',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'direct_bonus',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'match_bonus',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'deposits',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'deposit_time',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'payouts',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'rolls',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'ref_claim_pos',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
]
