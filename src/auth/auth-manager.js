const Moralis = require('moralis')
Moralis.initialize('xYeTdqvHv8FkeH22TpKhNbWYjHkBGyLKWys3kjXD')
Moralis.serverURL = 'https://fz1jf2tm3lvr.moralisweb3.com:2053/server'

export default {
  getCurrentUser: () => {
    return Moralis.User.current()
  },
  getCurrentUserAddress: () => {
    return Moralis.User.current().get('ethAddress')
  },
  authenticate: async () => {
    return await Moralis.Web3.authenticate()
  },
  logout: async () => {
    await Moralis.User.logOut()
  }
}
