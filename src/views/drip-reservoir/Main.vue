<template>
  <div class="grid grid-cols-12 gap-6 mt-12">
    <div class="col-span-12 2xl:col-span-6 xl:pl-10">
      <p class="text-3xl mb-6">RESERVOIR</p>
      <DripReservoirCurrents />
    </div>

    <div class="col-span-12 2xl:col-span-6">
      <div class="flex flex-col p-4">
        <DripReservoirHistory />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import DripReservoirCurrents from '@/views/drip-reservoir-currents/Main.vue'
import DripReservoirHistory from '@/views/drip-reservoir-history/Main.vue'
export default defineComponent({
  components: { DripReservoirCurrents, DripReservoirHistory },
  setup() {
    return {}
  }
})
</script>
