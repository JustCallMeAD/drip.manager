import abi from './abi/buddy.json'
import addresses from './smartcontracts-addresses'

class BuddyContract {
  constructor(web3, userAddress) {
    this.contract = new web3.eth.Contract(abi, addresses.BUDDY_ADDRESS)
    this.userAddress = userAddress
  }

  // Write to blockchain
  setBuddy(buddyAddress) {
    return this.contract.methods.updateBuddy(buddyAddress).send({ from: this.userAddress })
  }
}

export default BuddyContract
