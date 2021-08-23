import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import authManager from './auth/auth-manager'
import globalComponents from './global-components'
import utils from './utils'
import './libs'

// SASS Theme
import './assets/sass/app.scss'

router.beforeEach((to, from, next) => {
  const currentUser = authManager.getCurrentUser()
  if (to.name !== 'login' && !currentUser) {
    next({ name: 'login' })
  } else {
    next()
  }
})

const app = createApp(App)
  .use(store)
  .use(router)

globalComponents(app)
utils(app)

app.mount('#app')
