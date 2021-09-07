import abi from './abi/fountain.json'
import addresses from './smartcontracts-addresses'

class FontainContract {
  constructor(archiveWeb3, web3) {
    this.archiveWeb3 = archiveWeb3.eth
    this.archiveContract = new this.archiveWeb3.Contract(
      abi,
      addresses.FOUNTAIN_ADDRESS
    )
    this.contract = new web3.eth.Contract(abi, addresses.FOUNTAIN_ADDRESS)
  }

  async getBnbToTokenOutputPrice(tokenBought) {
    return await this.archiveContract.methods
      .getBnbToTokenOutputPrice(tokenBought)
      .call()
  }

  async getTokenToBnbOutputPrice(bnbBought, hoursAgo) {
    if (hoursAgo) {
      const currentBlock = await this.archiveWeb3.getBlockNumber()
      const block = currentBlock - (hoursAgo || 0) * 1161
      return await this.archiveContract.methods
        .getTokenToBnbOutputPrice(bnbBought)
        .call({}, block)
    }

    return await this.archiveContract.methods
      .getTokenToBnbOutputPrice(bnbBought)
      .call()
  }

  /**
   * @param bnb_sold Amount of BNB sold.
   * @return Amount of Tokens that can be bought with input BNB.
   */
  async getBnbToTokenInputPrice(bnbSold) {
    return await this.archiveContract.methods
      .getBnbToTokenInputPrice(bnbSold)
      .call()
  }

  /**
   * @param tokens_sold Amount of Tokens sold.
   * @return Amount of BNB that can be bought with input Tokens.
   */
  async getTokenToBnbInputPrice(tokenSold) {
    return await this.archiveContract.methods
      .getTokenToBnbInputPrice(tokenSold)
      .call()
  }

  async getBalanceOf(address) {
    const values = await this.archiveContract.methods.statsOf(address).call()
    return values[0]
  }

  async tokenToBnbSwapInput(tokenSold, minBnb, address) {
    await this.contract.methods
      .tokenToBnbSwapInput(tokenSold, minBnb)
      .send({ from: address })
  }

  async bnbToTokenSwapInput(bnbSold, minToken, address) {
    await this.contract.methods
      .bnbToTokenSwapInput(minToken)
      .send({ from: address, value: bnbSold })
  }
}

export default FontainContract
