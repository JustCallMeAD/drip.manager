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

// SASS Theme
import './assets/sass/app.scss'

const guestPath = ['/calculator']

router.beforeEach(async (to, from, next) => {
  if (guestPath.includes(to.path)) {
    next()
  }

  const walletAddress = await window.ethereum.request({ method: 'eth_requestAccounts' })
  console.log(walletAddress[0])
  // const web3 = await authManager.getWeb3()
  // console.log('here')
  // const accounts = await web3.eth.getAccounts()
  // console.log(accounts)
  const currentUserAddress = authManager.getCurrentUserAddress()

  if (to.name !== 'login' && currentUserAddress && currentUserAddress != walletAddress[0]) {
    next({ name: 'login' })
    return
  }

  // if (!accounts || accounts.length == 0) {
  //   if (currentUser) {
  //     await authManager.logout()
  //   }

  //   next({ name: 'login' })
  // } else {
  if (to.name !== 'login' && !currentUserAddress) {
    next({ name: 'login' })
  } else {
    next()
  }
  // }
})

const app = createApp(App).use(store).use(router).use(PrimeVue)

globalComponents(app)
utils(app)

app.mount('#app')
