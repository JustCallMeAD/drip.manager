<template>
  <div class="intro-y box p-5 mt-5">
    <h2 class="text-lg font-medium truncate mr-5">Deposits spread</h2>
    <Chart
      type="pie"
      :width="width"
      :height="height"
      :data="data"
      :options="options"
    />
    <div class="mt-8">
      <div class="flex items-center">
        <div class="w-2 h-2 bg-theme-11 rounded-full mr-3"></div>
        <span class="truncate">17 - 30 Years old</span>
        <div
          class="
            h-px
            flex-1
            border border-r border-dashed border-gray-300
            mx-3
            xl:hidden
          "
        ></div>
        <span class="font-medium xl:ml-auto">62%</span>
      </div>
      <div class="flex items-center mt-4">
        <div class="w-2 h-2 bg-theme-1 rounded-full mr-3"></div>
        <span class="truncate">31 - 50 Years old</span>
        <div
          class="
            h-px
            flex-1
            border border-r border-dashed border-gray-300
            mx-3
            xl:hidden
          "
        ></div>
        <span class="font-medium xl:ml-auto">33%</span>
      </div>
      <div class="flex items-center mt-4">
        <div class="w-2 h-2 bg-theme-12 rounded-full mr-3"></div>
        <span class="truncate">>= 50 Years old</span>
        <div
          class="
            h-px
            flex-1
            border border-r border-dashed border-gray-300
            mx-3
            xl:hidden
          "
        ></div>
        <span class="font-medium xl:ml-auto">10%</span>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useStore } from '@/store'

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
  setup() {
    const store = useStore()
    const darkMode = computed(() => store.state.main.darkMode)
    const data = computed(() => {
      return {
        labels: ['Yellow', 'Dark'],
        datasets: [
          {
            data: [60, 10, 65],
            backgroundColor: ['#FF8B26', '#FFC533', '#285FD3'],
            hoverBackgroundColor: ['#FF8B26', '#FFC533', '#285FD3'],
            borderWidth: 5,
            borderColor: darkMode.value ? '#303953' : '#fff'
          }
        ]
      }
    })
    const options = computed(() => {
      return {
        legend: {
          display: false
        }
      }
    })

    return {
      data,
      options
    }
  }
})
</script>
