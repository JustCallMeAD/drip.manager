<template>
  <div class="intro-y mt-3">
    <div class="flex flex-col p-2">
      <div class="flex flex-row">
        <div>
          <h2 class="text-lg font-medium truncate mr-5">Airdrops history</h2>
        </div>
        <div>
          <LoadingIcon
            v-if="isLoading"
            icon="spinning-circles"
            class="w-8 h-8"
          />
        </div>
      </div>
      <div class="overflow-y-scroll h-96">
        <div v-for="data in listDataHolder" :key="data.id" class="box m-1">
          <div class="grid grid-cols-3 mr-auto p-2">
            <div class="col-span-2">
              <a
                :href="'https://bscscan.com/tx/' + data.transactionHash"
                target="_blank"
                >{{ data.date }} <ExternalLinkIcon
              /></a>
            </div>
            <div class="text-right">{{ data.amount }} DRIP</div>
            <div class="col-span-2">From: {{ data.from }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, ref, watch } from 'vue'
import { useStore } from '@/store'
import getAirdrops from '@/http/getAirdrops.js'

export default defineComponent({
  methods: {
    toDate: (epochDate) => {
      var d = new Date(0) // The 0 there is the key, which sets the date to the epoch
      d.setUTCSeconds(epochDate)
      return d.toLocaleString()
    }
  },
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
    const store = useStore()
    this.updater = async function () {
      this.listData.value = []
      var currentUserAddress = store.state.main.userAddress
      if (!currentUserAddress) {
        return
      }

      try {
        this.isLoading = true
        const response = await getAirdrops(currentUserAddress)
        const list = []
        for (const current of response.data) {
          const amount = (current.amount / 10 ** 18).toFixed(2)
          list.push({
            id: current._id,
            transactionHash: current.transactionHash,
            from:
              current.from.substr(0, 4) +
              '..' +
              current.from.substr(current.from.length - 5),
            amount: amount,
            date: this.toDate(current.timestamp)
          })
        }

        this.listData = list
      } catch (e) {
      } finally {
        this.isLoading = false
      }
    }

    watch(
      computed(() => store.state.main.userAddress),
      () => {
        this.updater()
      }
    )
    this.updater()
  },
  setup() {
    const listData = ref([])
    const listDataHolder = computed(() => listData.value)
    const isLoading = ref(false)

    return {
      isLoading,
      listData,
      listDataHolder
    }
  }
})
</script>
<style scoped>
svg.feather {
  height: 1em;
  margin-top: -4px;
  pointer-events: none;
  vertical-align: middle;
  width: 1em;
}
</style>
