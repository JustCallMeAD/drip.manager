<template>
  <div class="box p-5 intro-y">
    <div class="p-formgroup-inline">
      <div class="p-field">
        <span class="p-float-label">
          <InputText id="username" type="text" v-model="buddyAddress" />
          <label for="username">Enter Buddy address</label>
        </span>
      </div>
      <Button label="Preview" class="p-button-raised" />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

export default defineComponent({
  components: {
    InputText, Button
  },
  props: {},
  async mounted() {},
  setup() {
    const buddyAddress = ref(null)
    return { buddyAddress }
  }
})
</script>
