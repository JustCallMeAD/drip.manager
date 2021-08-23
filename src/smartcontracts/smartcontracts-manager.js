import Moralis from 'moralis'
import FaucetContract from './faucet-contract.js'
let web3

const init = async () => {
  if (!web3) {
    web3 = await Moralis.Web3.enable()
    // alert(await web3.eth.getAccounts())
  }
  return web3
}

export default {
  async getWeb3() {
    await init()
    return web3
  },
  async getFaucetContract(userAddress) {
    return init().then(web3 => new FaucetContract(web3, userAddress)).catch(e => console.log(e))
  }
}
