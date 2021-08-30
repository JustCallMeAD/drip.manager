import Moralis from 'moralis'
import FaucetContract from './faucet-contract.js'
import FountainContract from './fountain-contract.js'
import BuddyContract from './buddy-contract.js'
let web3

const init = async () => {
  if (!web3) {
    web3 = await Moralis.Web3.enable()
  }
  return web3
}

export default {
  async getWeb3() {
    await init()
    return web3
  },
  async getBuddyContract(userAddress) {
    return init().then(web3 => new BuddyContract(web3, userAddress)).catch(e => console.log(e))
  },
  async getFaucetContract(userAddress) {
    return init().then(web3 => new FaucetContract(web3, userAddress)).catch(e => console.log(e))
  },
  async getFountainContract() {
    return init().then(web3 => new FountainContract(web3)).catch(e => console.log(e))
  }
}
