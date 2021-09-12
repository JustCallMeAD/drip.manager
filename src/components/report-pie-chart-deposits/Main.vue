<template>
  <div class="intro-y box p-5 mt-5">
    <h2 :v-if="false" class="text-lg font-medium truncate mr-5">
      Deposits distribution
    </h2>
    <Chart
      :key="'theChart'"
      type="bar"
      :width="width"
      :height="height"
      :data="data"
      :options="options"
    />
    <div class="mt-4">
      <div class="flex items-center">
        <div class="w-2 h-2 mr-3"></div>
        <span class="truncate font-medium">Range</span>
        <div
          class="
            h-px
            flex-1
            border border-r border-dashed border-gray-300
            mx-3
            xl:hidden
          "
        ></div>
        <span class="font-medium xl:ml-auto"># Drippers</span>
      </div>
      <div
        class="flex items-center"
        v-for="(value, index) in chartLegend"
        :key="value"
      >
        <div class="w-2 h-2 bg-theme-11 rounded-full mr-3"></div>
        <span class="truncate">{{ value }}</span>
        <div
          class="
            h-px
            flex-1
            border border-r border-dashed border-gray-300
            mx-3
            xl:hidden
          "
        ></div>
        <span class="font-medium xl:ml-auto">{{ chartData[index] }}</span>
      </div>
      <div class="flex items-center">
        <div
          class="
            w-px
            h-12
            border border-r border-solid border-gray-300
            dark:border-dark-5
            mx-4
            xl:mx-5
          "
        ></div>
        <span class="truncate font-bold">Total faucet drippers</span>
        <div
          class="
            h-px
            flex-1
            border border-r border-dashed border-gray-300
            mx-3
            xl:hidden
          "
        ></div>
        <span class="font-medium xl:ml-auto font-bold border-t-2">{{
          chartDataTotalHolder
        }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, ref } from 'vue'
import { useStore } from '@/store'
import getDepositsCounts from '@/http/getDepositCounts.js'

export default defineComponent({
  props: {
    width: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    }
  },
  async mounted() {
    try {
      const stats = await getDepositsCounts([
        1, 10, 50, 100, 500, 1000, 2000, 5000
      ])

      this.chartData = stats.data.results
      this.chartDataTotalHolder = stats.data.sum
    } catch (e) {}
  },
  setup() {
    const store = useStore()
    const darkMode = computed(() => store.state.main.darkMode)

    const chartData = ref([])
    const chartDataHolder = computed(() => chartData.value)

    const chartDataTotalHolder = ref(0)

    const chartBackgroudColor = computed(() => [
      '#6247aa',
      '#7251B5',
      '#815AC0',
      '#9163CB',
      '#A06CD5',
      '#B185DB',
      '#C19EE0',
      '#D2B7E5'
    ])
    const chartHoverBackgroudColor = computed(() => [
      '#6247aa',
      '#7251B5',
      '#815AC0',
      '#9163CB',
      '#A06CD5',
      '#B185DB',
      '#C19EE0',
      '#D2B7E5'
    ])

    const chartLegend = computed(() => [
      '1 - 9 DRIPS',
      '10 - 49 DRIPS',
      '50 - 99 DRIPS',
      '100 - 499 DRIPS',
      '500 - 999 DRIPS',
      '1000 - 1999 DRIPS',
      '2000 - 4999 DRIPS',
      '5000+ DRIPS'
    ])

    const data = computed(() => {
      return {
        labels: chartLegend.value,
        chartDataTotalHolder,
        datasets: [
          {
            data: chartDataHolder.value,
            backgroundColor: chartBackgroudColor.value,
            hoverBackgroundColor: chartHoverBackgroudColor.value,
            borderWidth: 2,
            borderColor: darkMode.value ? '#303953' : '#fff'
          }
        ]
      }
    })
    const options = computed(() => {
      return {
        legend: {
          display: false,
          position: 'chartArea'
        }
      }
    })

    return {
      data,
      chartDataTotalHolder,
      chartData,
      chartLegend,
      options
    }
  }
})
</script>
