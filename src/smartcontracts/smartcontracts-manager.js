import FaucetContract from './faucet-contract.js'
import FountainContract from './fountain-contract.js'
import ReservoirContract from './reservoir-contract.js'
import BuddyContract from './buddy-contract.js'
import DripContract from './drip-contract.js'

const Web3 = require('web3')

let web3
let archiveWeb3

const init = async () => {
  if (!web3) {
    web3 = new Web3(await window.ethereum)
  }

  // Archive nodes are useful to get historical data from previous blocks
  if (!archiveWeb3) {
    const provider = new Web3.providers.HttpProvider(
      'https://speedy-nodes-nyc.moralis.io/ee7441bea90c1d0d1390bf6d/bsc/mainnet/archive'
    )
    archiveWeb3 = new Web3(provider)
  }
}

export default {
  async getWeb3() {
    await init()
    return web3
  },
  async getBnbBalanceOf(userAddress) {
    return init()
      .then(() => web3.eth.getBalance(userAddress))
      .catch((e) => console.log(e))
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
  async getReservoirContract(userAddress) {
    return init()
      .then(() => new ReservoirContract(web3))
      .catch((e) => console.log(e))
  },
  async getFountainContract() {
    return init()
      .then(() => {
        return new FountainContract(archiveWeb3, web3)
      })
      .catch((e) => console.log(e))
  },
  async getDripContract() {
    return init()
      .then(() => new DripContract(web3))
      .catch((e) => console.log(e))
  }
}
