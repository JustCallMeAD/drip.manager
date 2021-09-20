<template>
  <div>
    <div class="intro-x flex h-10">
      <h2 class="text-lg font-medium truncate mr-5">Transactions history</h2>
      <span class="text-xs truncate mr-5"
        >*Transactions are refreshed every 5 minutes.</span
      >
    </div>
    <div class="">
      <div class="intro-x">
        <div class="grid grid-rows-2 grid-cols-3 grid-flow-col lg:grid-cols-6 lg:grid-rows-1 lg:grid-flow-row mr-auto mt-3 px-5 py-3 mb-3 font-semibold">
          <div class="lg:col-span-2 font-medium">Date</div>
          <div class="mt-0.5">Event</div>
          <div class="mt-0.5 lg:text-right">Transaction BNB</div>
          <div class="mt-0.5 lg:text-right">Transaction DROPS</div>
          <div class="mt-0.5 lg:text-right">DROPS Balance</div>
        </div>
        <div class="flex flex-col" v-if="isLoading">
          <div class="mx-auto"></div>
          <div class="h-6">
            <LoadingIcon icon="spinning-circles" class="w-8 h-8" />
          </div>
          <div class="mx-auto"></div>
        </div>
        <div class="overflow-y-scroll h-96">
          <div
            v-for="history in historyContainer"
            :key="history.id"
            class="box mt-3 px-5 py-3 mb-3"
          >
            <div class="grid grid-rows-2 grid-cols-3 grid-flow-col lg:grid-cols-6 lg:grid-rows-1 lg:grid-flow-row mr-auto">
              <div class="lg:col-span-2 font-medium">
                {{ history.date }}
                <a
                  :href="'https://bscscan.com/tx/' + history.id"
                  target="_blank"
                  ><ExternalLinkIcon
                /></a>
              </div>
              <div class="mt-0.5">{{ history.event }}</div>
              <div class="mt-0.5 lg:text-right">
                {{
                  history.transaction_bnb
                    ? history.transaction_bnb + ' BNB'
                    : ''
                }}
              </div>
              <div class="mt-0.5 lg:text-right">
                {{
                  history.transaction_drops
                    ? history.transaction_drops + ' DROPS'
                    : ''
                }}
              </div>
              <div class="mt-0.5 lg:text-right">
                {{ history.drops ? history.drops + ' DROPS' : '' }}
              </div>
            </div>
          </div>
        </div>
        <!-- <div v-if="!isLoading">
          <a href="" class="ml-5 text-theme-1 dark:text-theme-10 truncate"
            >Show More</a
          >
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch, computed } from 'vue'
import store from '@/store'
import getReservoirHistory from '@/http/getReservoirHistory.js'

export default defineComponent({
  components: {},
  methods: {
    toDate: (epochDate) => {
      var d = new Date(0) // The 0 there is the key, which sets the date to the epoch
      d.setUTCSeconds(epochDate)
      return d.toLocaleString()
    },
    extractBnb: (history) => {
      if (history.events.includes('onTokenPurchase')) {
        return (history.incomingeth / 10 ** 18).toFixed(4)
      }
      return 0
    },
    extractDrops: (history) => {
      if (history.events.includes('onTokenPurchase')) {
        return {
          trans: (history.tokensMinted / 10 ** 18).toFixed(4),
          balance: (history.tokens / 10 ** 18).toFixed(4)
        }
      }
      return { trans: 0, balance: 0 }
    },
    eventToLabel: (history) => {
      if (history.events.includes('onReinvestment')) {
        return 'Compound'
      } else if (history.events.includes('onTokenPurchase')) {
        return 'Buy'
      } else if (history.events.includes('onWithdraw')) {
        return 'Withdraw'
      }
      return 'Claim'
    },
    toBnbEquivalence: (value) => {
      return (value / 10 ** 18).toFixed(4)
    }
  },
  async mounted() {
    this.updater = async function () {
      var currentUserAddress = store.state.main.userAddress
      if (!currentUserAddress) {
        return
      }

      this.isLoading = true
      const rawHistory = await getReservoirHistory(currentUserAddress)

      const history = []
      for (const current of rawHistory.data) {
        var data = {}
        data.id = current._id
        data.event = this.eventToLabel(current)
        data.date = this.toDate(current.timestamp)

        if (current.events.includes('onTokenPurchase')) {
          data.transaction_bnb = (current.incomingeth / 10 ** 18).toFixed(4)
          data.transaction_drops = (current.tokensMinted / 10 ** 18).toFixed(4)
        } else if (current.events.includes('onWithdraw')) {
          data.transaction_bnb = (current.ethWithdrawn / 10 ** 18).toFixed(4)
        } else if (current.events.includes('onTokenSell')) {
          data.transaction_drops = (current.tokensBurned / 10 ** 18).toFixed(4)
        }

        if (current.tokens) {
          data.drops = (current.tokens / 10 ** 18).toFixed(4)
        }
        history.push(data)
      }

      this.history = history
      this.isLoading = false
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
    const history = ref([])
    const historyContainer = computed(() => history.value)
    const isLoading = ref(false)
    return { history, historyContainer, isLoading }
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
