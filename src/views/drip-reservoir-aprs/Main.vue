<template>
  <div class="box">
    <div class="intro-x flex items-center h-10 ml-5">
      <h2 class="text-lg font-medium truncate mr-5 mt-3">
        Reservoir performance history
      </h2>
    </div>
    <div>
      <div class="p-2 text-center">
        <div class="grid sm:grid-cols-3 gap-4">
          <div>
            <div class="text-gray-600 dark:text-gray-600 text-xs">
              Yesterday
            </div>
            <div>
              <span class="text-xs">APR: </span>
              <span class="text-xl font-medium">{{ yesterdayApr }} %</span>
            </div>
            <div>
              <span class="text-xs">APY: </span>
              <span class="text-xl font-medium">{{ yesterdayApy }} %</span>
            </div>
          </div>
          <div>
            <div class="text-gray-600 dark:text-gray-600 text-xs">
              7 Days
            </div>
            <div>
              <span class="text-xs">APR: </span>
              <span class="text-xl font-medium">{{ sevenDayApr }} %</span>
            </div>
            <div>
              <span class="text-xs">APY: </span>
              <span class="text-xl font-medium">{{ sevenDayApy }} %</span>
            </div>
          </div>
          <div>
            <div class="text-gray-600 dark:text-gray-600 text-xs">
              30 Days
            </div>
            <div>
              <span class="text-xs">APR: </span>
              <span class="text-xl font-medium">{{ thirtyDayApr }} %</span>
            </div>
            <div>
              <span class="text-xs">APY: </span>
              <span class="text-xl font-medium">{{ thirtyDayApy }} %</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import getReservoirAprs from '@/http/getReservoirAprs.js'

export default defineComponent({
  components: {},
  async mounted() {
    const aprs = await getReservoirAprs()
    var apr = 0
    for (let i = 0; i < aprs.data.length; i++) {
      apr += aprs.data[i].apr
      if (i == 0) {
        this.yesterdayApr = (apr * 100).toFixed(3)
        this.yesterdayApy = (apr * 36500).toFixed(2)
      } else if (i == 6) {
        this.sevenDayApr = (apr * 100).toFixed(3)
        this.sevenDayApy = (apr * 36500 / 7).toFixed(2)
      } else if (i == 29) {
        this.thirtyDayApr = (apr * 100).toFixed(3)
        this.thirtyDayApy = (apr * 36500 / 30).toFixed(2)
        break
      }
    }
  },
  setup() {
    const yesterdayApr = ref(0)
    const sevenDayApr = ref(0)
    const thirtyDayApr = ref(0)

    const yesterdayApy = ref(0)
    const sevenDayApy = ref(0)
    const thirtyDayApy = ref(0)
    return {
      yesterdayApr,
      sevenDayApr,
      thirtyDayApr,
      yesterdayApy,
      sevenDayApy,
      thirtyDayApy
    }
  }
})
</script>
