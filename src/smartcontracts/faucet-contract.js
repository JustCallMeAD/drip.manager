import abi from './abi/faucet.json'
import addresses from './smartcontracts-addresses'
const decimals = 10 ** 18

class FaucetContract {
  constructor(web3, userAddress) {
    this.contract = new web3.eth.Contract(abi, addresses.FAUCET_ADDRESS)
    this.userAddress = userAddress
  }

  async getClaimsAvailable(precision) {
    return round(
      (await this.contract.methods.claimsAvailable(this.userAddress).call()) /
        decimals,
      precision
    )
  }

  async getUserInfoTotals(address) {
    const userInfoTotals = await this.contract.methods
      .userInfoTotals(!address ? this.userAddress : address)
      .call()
    return {
      referrals: userInfoTotals.referrals,
      total_deposits: userInfoTotals.total_deposits / decimals,
      total_payouts: userInfoTotals.total_payouts / decimals,
      total_structure: userInfoTotals.total_structure,
      airdrops_total: userInfoTotals.airdrops_total / decimals,
      airdrops_received: userInfoTotals.airdrops_received / decimals
    }
  }

  async getUserInfo(address) {
    return await this.contract.methods
      .userInfo(!address ? this.userAddress : address)
      .call()
  }

  async getDepositBalance(precision) {
    const userInfoTotals = await this.getUserInfoTotals()
    return round(userInfoTotals.total_deposits, precision)
  }

  async getClaimedAmount(precision) {
    const userInfoTotals = await this.getUserInfoTotals()
    return round(userInfoTotals.total_payouts, precision)
  }

  async getMaxPayout(precision) {
    return round(
      (await this.contract.methods.payoutOf(this.userAddress).call())
        .max_payout / decimals,
      precision
    )
  }

  async getBuddyAddress() {
    const userInfo = await this.getUserInfo()
    return userInfo.upline
  }

  // Write to blockchain
  hydrate() {
    return this.contract.methods.roll().send({ from: this.userAddress })
  }

  // Write to blockchain
  claim() {
    return this.contract.methods.claim().send({ from: this.userAddress })
  }
}

function round(value, roundDecimal) {
  if (!value) {
    return 0
  }
  if (typeof value == 'string') {
    value = parseFloat(value)
  }
  if (roundDecimal) {
    value = value.toFixed(roundDecimal)
  }

  return value
}

export default FaucetContract
