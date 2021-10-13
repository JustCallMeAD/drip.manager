<template>
  <div class="grid grid-cols-12 mt-2">
    <div class="col-span-2"></div>
    <div class="col-span-12 sm:col-span-8 ">
      <iframe
        class="w-full h-screen object-contain"
        src="https://drip-trading-view.herokuapp.com/"
        allowfullscreen
      ></iframe>
    </div>
    <div class="col-span-2"></div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  components: {},
  async mounted() {},
  unmounted() {},
  setup() {
    return {}
  },
  methods: {}
})
</script>
