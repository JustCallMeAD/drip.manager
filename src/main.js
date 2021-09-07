import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import authManager from './auth/auth-manager'
import globalComponents from './global-components'
import utils from './utils'
import './libs'
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import Moralis from 'moralis'

// SASS Theme
import './assets/sass/app.scss'

const guestPath = ['/calculator']

router.beforeEach(async (to, from, next) => {
  if (guestPath.includes(to.path)) {
    next()
  }

  try {
    const walletAddress = await window.ethereum.request({
      method: 'eth_requestAccounts'
    })

    const currentUserAddress = authManager.getCurrentUserAddress()

    if (
      to.name !== 'login' &&
      currentUserAddress &&
      currentUserAddress !== walletAddress[0]
    ) {
      next({ name: 'login' })
      return
    }
    if (to.name !== 'login' && !currentUserAddress) {
      next({ name: 'login' })
    } else {
      next()
    }
  } catch (e) {
    next({ name: 'login' })
  }
  // }
})

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

const app = createApp(App).use(store).use(router).use(PrimeVue)

globalComponents(app)
utils(app)

app.mount('#app')
