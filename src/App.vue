<template>
  <router-view />
</template>
<script>
import { defineComponent } from 'vue'
import * as types from './store/mutation-types'
import store from './store'

export default defineComponent({
  async beforeCreate() {
    store.commit('main/' + types.INIT)

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts) {
          store.dispatch('main/setUserAddress', accounts[0])
        }
      })

      try {
        // alert(store.state.main.userAddress)
        const address = window.ethereum.selectedAddress
        store.dispatch('main/setUserAddress', address)
      } catch (error) {
        // user rejected permission
        console.log('user rejected permission')
      }
    }
  }
})
</script>
