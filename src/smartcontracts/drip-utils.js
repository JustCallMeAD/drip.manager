import pancakeSwapAbi from './abi/pancakeswap.json'
import Web3 from 'web3'

export default {
  calculateDripBnbRatio: function (bnbCount, dripCount) {
    return dripCount / bnbCount
  },
  calcBNBPrice: async function () {
    const pancakeSwapContract =
      '0x10ED43C718714eb63d5aA57B78B54704E256024E'.toLowerCase()
    const web3 = new Web3('https://bsc-dataseed1.binance.org')
    const BNBTokenAddress = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c' // BNB
    const USDTokenAddress = '0x55d398326f99059fF775485246999027B3197955' // USDT
    const bnbToSell = web3.utils.toWei('1', 'ether')
    let amountOut
    try {
      const router = new web3.eth.Contract(pancakeSwapAbi, pancakeSwapContract)
      amountOut = await router.methods
        .getAmountsOut(bnbToSell, [BNBTokenAddress, USDTokenAddress])
        .call()
      amountOut = parseFloat(web3.utils.fromWei(amountOut[1]))
    } catch (error) {}
    if (!amountOut) return 0
    return amountOut
  },
  convertFromWei: function (value, fixed) {
    if (!value) {
      return 0
    }

    if (fixed) {
      return (value / 10 ** 18).toFixed(fixed)
    }
    return value / 10 ** 18
  }
}
