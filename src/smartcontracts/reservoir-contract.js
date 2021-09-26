import abi from './abi/reservoir.json'
import addresses from './smartcontracts-addresses'

// const decimals = 10 ** 18
var statOfIndex = [
  'invested',
  'withdrawn',
  'rewarded',
  'taxes',
  'contributed',
  'transferredTokens',
  'receivedTokens',
  'xInvested',
  'xRewarded',
  'xContributed',
  'xWithdrawn',
  'xTransferredTokens',
  'xReceivedTokens',
  'reinvested',
  'xReinvested'
]

class ReservoirContract {
  constructor(web3) {
    this.contract = new web3.eth.Contract(abi, addresses.RESERVOIR_ADDRESS)
  }

  async getUserStats(address) {
    var stats = {}
    const statsOf = await this.contract.methods.statsOf(address).call()
    for (let i = 0; i < statOfIndex.length; i++) {
      const key = statOfIndex[i]
      stats[key] = statsOf[i]
    }

    const balanceOf = await this.contract.methods.balanceOf(address).call()
    stats.balanceOf = balanceOf

    var dailyEstimateBnb = 0
    if (balanceOf > 0) {
      dailyEstimateBnb = await this.contract.methods
        .dailyEstimateBnb(address)
        .call()
    }
    stats.dailyEstimateBnb = dailyEstimateBnb

    return stats
  }

  async calculateBnbDropRatio() {
    const one = 10 ** 18
    const bnbPerDrip = await this.contract.methods
      .calculateLiquidityToBnb(one.toString())
      .call()

    return bnbPerDrip
  }

  async calculateLiquidityToBnb(drops) {
    return await this.contract.methods.calculateLiquidityToBnb(drops).call()
  }

  async getContractDropsBalance() {
    return await this.contract.methods.lockedTokenBalance().call()
  }

  async getTotalSupply() {
    return await this.contract.methods.totalSupply().call()
  }

  async getRewards(address) {
    return await this.contract.methods.myDividends().call({ from: address })
  }

  async compound(address) {
    return await this.contract.methods.reinvest().send({ from: address })
  }

  async claim(address) {
    return await this.contract.methods.withdraw().send({ from: address })
  }
}

export default ReservoirContract
