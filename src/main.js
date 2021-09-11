import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import globalComponents from './global-components'
import utils from './utils'
import './libs'
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

// SASS Theme
import './assets/sass/app.scss'

const app = createApp(App).use(store).use(router).use(PrimeVue)

globalComponents(app)
utils(app)

app.mount('#app')
