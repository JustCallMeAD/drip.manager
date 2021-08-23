
import abi from './abi/faucet.json'
const smartCootractAddress = '0xFFE811714ab35360b67eE195acE7C10D93f89D8C'
const decimals = 10 ** 18

class FaucetContract {
  constructor(web3, userAddress) {
    this.contract = new web3.eth.Contract(abi, smartCootractAddress)
    this.userAddress = userAddress
  }

  async getClaimsAvailable() {
    return (await this.contract.methods.claimsAvailable(this.userAddress).call()) / decimals
  }

  async getDepositBalance() {
    return (await this.contract.methods.claimsAvailable(this.userAddress).call()) / 10 ** 18
  }
};

export default FaucetContract
