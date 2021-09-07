const Moralis = require('moralis')
Moralis.initialize('xYeTdqvHv8FkeH22TpKhNbWYjHkBGyLKWys3kjXD')
Moralis.serverURL = 'https://fz1jf2tm3lvr.moralisweb3.com:2053/server'

export default {
  getWeb3: () => {
    return window.etheruem
  },
  getCloudRunner: () => {
    return Moralis.Cloud.run
  },
  getCurrentUser: () => {
    return Moralis.User.current()
  },
  getCurrentUserAddress: () => {
    const currentUser = Moralis.User.current()
    return !currentUser ? undefined : currentUser.get('ethAddress')
  },
  authenticate: (router) => {
    const disconnect = async () => {
      await Moralis.User.logOut()
      await router.push({ path: '/login' })
    }
    Moralis.Web3.onAccountsChanged(function (accounts) {
      disconnect()
    })
    Moralis.Web3.onDisconnect(function (accounts) {
      disconnect()
    })
    Moralis.Web3.onChainChanged(function (accounts) {
      disconnect()
    })

    return Moralis.Web3.authenticate()
  },
  logout: () => {
    return Moralis.User.logOut()
  },
  isGuest: () => {
    return !Moralis.User.current()
  }
}
