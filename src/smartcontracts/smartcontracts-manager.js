import Moralis from 'moralis'
import FaucetContract from './faucet-contract.js'
import FountainContract from './fountain-contract.js'
import BuddyContract from './buddy-contract.js'

const Web3 = require('web3')

let web3
let archiveWeb3

const init = async () => {
  if (!web3) {
    web3 = await Moralis.Web3.enable()
  }

  // Archive nodes are useful to get historical data from previous blocks
  if (!archiveWeb3) {
    const provider = new Web3.providers.HttpProvider(
      'https://speedy-nodes-nyc.moralis.io/ee7441bea90c1d0d1390bf6d/bsc/mainnet/archive'
    )
    archiveWeb3 = new Web3(provider)
  }
  // return { web3, archiveWeb3 }
}

export default {
  async getWeb3() {
    await init()
    return web3
  },
  async getBuddyContract(userAddress) {
    return init()
      .then(() => new BuddyContract(web3, userAddress))
      .catch((e) => console.log(e))
  },
  async getFaucetContract(userAddress) {
    return init()
      .then(() => new FaucetContract(web3, userAddress))
      .catch((e) => console.log(e))
  },
  async getFountainContract() {
    return init()
      .then(() => new FountainContract(archiveWeb3))
      .catch((e) => console.log(e))
  }
}
