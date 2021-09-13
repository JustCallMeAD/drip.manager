import abi from './abi/faucet.json'
import addresses from './smartcontracts-addresses'
const decimals = 10 ** 18

class FaucetContract {
  constructor(web3, userAddress) {
    this.contract = new web3.eth.Contract(abi, addresses.FAUCET_ADDRESS)
    this.userAddress = userAddress
  }

  async getClaimsAvailable(address) {
    return (
      (await this.contract.methods.claimsAvailable(address).call()) / decimals
    )
  }

  async getUserInfoTotals(address) {
    const userInfoTotals = await this.contract.methods
      .userInfoTotals(address)
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
    return await this.contract.methods.userInfo(address).call()
  }

  async getDepositBalance(address) {
    const userInfoTotals = await this.getUserInfoTotals(address)
    return userInfoTotals.total_deposits
  }

  async getClaimedAmount(address) {
    const userInfoTotals = await this.getUserInfoTotals(address)
    return userInfoTotals.total_payouts
  }

  async getMaxPayout(address) {
    return (
      (await this.contract.methods.payoutOf(address).call())
        .max_payout / decimals
    )
  }

  async getBuddyAddress(address) {
    const userInfo = await this.getUserInfo(address)
    return userInfo.upline
  }

  async queryFaucetGlobalUserInfo(address) {
    const userInfoTotals = await this.getUserInfoTotals(address)
    const userInfo = await this.getUserInfo(address)
    const users = await this.contract.methods.users(address).call()
    const maxPayouts = await this.contract.methods.payoutOf(address).call()
    const claimsAvailable = await this.contract.methods
      .claimsAvailable(address)
      .call()
    return {
      ...userInfoTotals,
      ...userInfo,
      max_payouts: maxPayouts,
      claim_available: claimsAvailable,
      ...users
    }
  }

  // Write to blockchain
  hydrate(address) {
    return this.contract.methods.roll().send({ from: address })
  }

  // Write to blockchain
  claim(address) {
    return this.contract.methods.claim().send({ from: address })
  }

  // Write to blockchain
  deposit(address, amount) {
    return this.contract.methods.deposit(address, amount).send({ from: address })
  }
}

export default FaucetContract
