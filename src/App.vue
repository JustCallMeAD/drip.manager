<template>
  <router-view />

  <div class="h-full">
    <textarea
      class="rounded-lg resize-none w-full h-full"
      v-model="consoleValue"
    ></textarea>
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
      window.ethereum.on('accountsChanged', async (accounts) => {
        if (accounts) {
          const chainId = await window.ethereum.request({
            method: 'eth_chainId'
          })

          if (chainId == 0x38) {
            store.dispatch('main/setUserAddress', accounts[0])
          } else {
            store.dispatch('main/setUserAddress', null)
          }
        }
      })
      window.ethereum.on('chainChanged', (chainId) => {
        if (chainId != 0x38) {
          store.dispatch('main/setUserAddress', null)
        } else {
          const address = window.ethereum.selectedAddress
          store.dispatch('main/setUserAddress', address)
        }
      })

      try {
        const address = window.ethereum.selectedAddress

        if (address) {
          const chainId = await window.ethereum.request({
            method: 'eth_chainId'
          })

          if (chainId == 0x38) {
            store.dispatch('main/setUserAddress', address)
          }
        }
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
