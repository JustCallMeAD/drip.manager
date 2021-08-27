import abi from './abi/fountain.json'
import addresses from './smartcontracts-addresses'
// const decimals = 10 ** 18

class FaucetContract {
  constructor(web3) {
    this.contract = new web3.eth.Contract(abi, addresses.FOUNTAIN_ADDRESS)
  }

  async getTokenToBnbOutputPrice(bnbBought) {
    return await this.contract.methods.getTokenToBnbOutputPrice(bnbBought).call()
  }
}

// function round(value, roundDecimal) {
//   if (!value) {
//     return 0
//   }
//   if (typeof value == 'string') {
//     value = parseFloat(value)
//   }
//   if (roundDecimal) {
//     value = value.toFixed(roundDecimal)
//   }

//   return value
// }

export default FaucetContract
