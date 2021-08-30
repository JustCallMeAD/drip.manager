<template>
  <Message severity="info" :closable="false">
    Section under construction
  </Message>
</template>

<script>
import { defineComponent } from 'vue'
import Message from 'primevue/message'

export default defineComponent({
  components: {
    Message
  },
  setup() {
    return {}
  }
})
</script>
