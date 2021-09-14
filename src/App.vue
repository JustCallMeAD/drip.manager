<template>
  <router-view />

  <div class="h-full">
      <textarea class="rounded-lg resize-none w-full h-full" v-model="consoleValue"></textarea>
    </div>
</template>
<script>
import { defineComponent, ref } from 'vue'
import * as types from './store/mutation-types'
import store from './store'

export default defineComponent({
  el: '#root',
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
  },
  setup() {
    const consoleValue = ref('')
    const oldConsole = console.log
    console.log = (message) => {
      consoleValue.value = consoleValue.value + '\r' + message
      oldConsole(message)
    }
    console.error = (message) => {
      consoleValue.value = consoleValue.value + '\r' + message
      oldConsole(message)
    }
    return { consoleValue }
  }
})
</script>
