<template>
  <Message severity="info" :closable="false">
    Section under construction
  </Message>
  <button @click="$refs.faucetDepositDropDown.show2()">Click me</button>
  <FaucetDepositDropDown ref="faucetDepositDropDown"/>
</template>

<script>
import { defineComponent } from 'vue'
import Message from 'primevue/message'
import FaucetDepositDropDown from '@/views/faucet-deposit/Main.vue'
export default defineComponent({
  components: {
    Message,
    FaucetDepositDropDown
  },
  setup() {
    return {}
  }
})
</script>
