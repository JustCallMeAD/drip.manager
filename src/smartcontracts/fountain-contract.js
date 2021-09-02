import abi from './abi/fountain.json'
import addresses from './smartcontracts-addresses'

class FaucetContract {
  constructor(web3) {
    this.web3 = web3.eth
    this.contract = new this.web3.Contract(abi, addresses.FOUNTAIN_ADDRESS)
  }

  async getTokenToBnbOutputPrice(bnbBought, hoursAgo) {
    const currentBlock = await this.web3.getBlockNumber()
    const block = currentBlock - ((hoursAgo || 0) * 1161)
    return await this.contract.methods
      .getTokenToBnbOutputPrice(bnbBought)
      .call({}, block)
  }
}

export default FaucetContract
