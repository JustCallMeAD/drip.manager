import abi from './abi/faucet.json'
import addresses from './smartcontracts-addresses'

// const decimals = 10 ** 18

class ReservoirContract {
  constructor(web3, userAddress) {
    this.contract = new web3.eth.Contract(abi, addresses.RESERVOIR_ADDRESS)
    this.userAddress = userAddress
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

export default ReservoirContract
