<template>
  <div class="grid grid-cols-12 gap-6 mt-12">
    <div class="col-span-12 2xl:col-span-6 xl:pl-10">
      <div class="grid grid-cols-12">
        <div class="col-span-12">
          <p class="text-3xl mb-6">RESERVOIR</p>
          <DripReservoirAprs />
        </div>
        <div class="col-span-12 mt-3">
          <DripReservoirCurrents ref="currents" />
        </div>

        <div class="col-span-12 mt-3">
          <div class="p-3 box bg-gray-400">
            <div
              class="
                flex flex-col
                sm:flex-row
                gap-3
                items-center
                justify-center
              "
            >
              <div class="rounded-r-lg font-bold">Rewards</div>
              <button
                :disabled="!isReady"
                @click="this.compound"
                class="btn btn-primary whitespace-nowrap"
              >
                <RefreshCwIcon class="w-4 h-4 mr-2" /> Compound
                {{ rewards }} BNB
              </button>
              <button
                :disabled="!isReady"
                @click="this.claim"
                class="btn btn-primary whitespace-nowrap"
              >
                <DollarSignIcon class="w-4 h-4 mr-2" /> Claim {{ rewards }} BNB
              </button>
            </div>
          </div>
        </div>

        <div class="col-span-12 mt-3">
          <div class="p-3 box bg-gray-400">
            <div
              class="
                flex flex-col
                sm:flex-row
                gap-3
                items-center
                sm:items-end
                justify-center
              "
            >
              <div class="font-bold">Buy & Deposit</div>
              <div class="flex flex-col">
                <div class="text-sm">Balance: {{bnbBalance}} BNB</div>
                <input
                  id="bnbToDrops"
                  :disabled="!isReady"
                  type="number"
                  class="form-control w-32 align-baseline"
                  placeholder="BNB"
                  v-model="buyAmount"
                />
              </div>
              <button
                :disabled="!isReady"
                autocomplete="off"
                min="0"
                @click="this.buyDrops"
                class="btn btn-primary whitespace-nowrap"
              >
                <ShoppingCartIcon class="w-4 h-4 mr-2" />
                Buy {{ buyDropsAmount }} DROPS
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-span-12 2xl:col-span-6">
      <div class="flex flex-col p-4">
        <DripReservoirHistory />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch, computed } from 'vue'
import store from '@/store'
import smManager from '@/smartcontracts/smartcontracts-manager'
import dripUtils from '@/smartcontracts/drip-utils'
import DripReservoirCurrents from '@/views/drip-reservoir-currents/Main.vue'
import DripReservoirHistory from '@/views/drip-reservoir-history/Main.vue'
import DripReservoirAprs from '@/views/drip-reservoir-aprs/Main.vue'
export default defineComponent({
  components: {
    DripReservoirCurrents,
    DripReservoirHistory,
    DripReservoirAprs
  },
  mounted() {
    this.buyDrops = async function () {
      var currentUserAddress = store.state.main.userAddress
      try {
        this.isReady = false
        const reservoir = await smManager.getReservoirContract()
        await reservoir.buy(
          (this.buyAmount * 10 ** 18).toString(),
          currentUserAddress
        )
        this.$refs.currents.updater()
      } catch (e) {
        alert(JSON.stringify(e))
        console.log(JSON.stringify(e))
      } finally {
        this.isReady = true
      }
    }

    this.claim = async function () {
      var currentUserAddress = store.state.main.userAddress
      try {
        this.isReady = false
        const reservoir = await smManager.getReservoirContract()
        await reservoir.claim(currentUserAddress)
        this.$refs.currents.updater()
        alert('Claim successful')
      } catch (e) {
        alert(JSON.stringify(e))
        console.log(JSON.stringify(e))
      } finally {
        this.isReady = true
      }
    }

    this.compound = async function () {
      var currentUserAddress = store.state.main.userAddress
      try {
        this.isReady = false
        const reservoir = await smManager.getReservoirContract()
        await reservoir.compound(currentUserAddress)
        this.$refs.currents.updater()
        alert('Compound successful')
      } catch (e) {
        alert(JSON.stringify(e))
        console.log(JSON.stringify(e))
      } finally {
        this.isReady = true
      }
    }

    this.updater = async function () {
      this.isReady = false
      var currentUserAddress = store.state.main.userAddress
      if (!currentUserAddress) {
        return
      }

      const bnbBalance = await smManager.getBnbBalanceOf(currentUserAddress)
      const reservoir = await smManager.getReservoirContract()
      const rewardsInDrops = await reservoir.getRewards(currentUserAddress)
      const rewardsInBnb = await reservoir.calculateLiquidityToBnb(
        rewardsInDrops
      )

      this.rewards = dripUtils.convertFromWei(rewardsInBnb).toFixed(4)
      this.bnbBalance = dripUtils.convertFromWei(bnbBalance).toFixed(4)

      this.isReady = true
    }

    watch(
      computed(() => store.state.main.userAddress),
      () => {
        this.updater()
      }
    )

    watch(
      computed(() => this.buyAmount),
      async () => {
        if (this.buyAmount < 0) {
          this.buyAmount = 0
          return
        }
        const reservoir = await smManager.getReservoirContract()
        const buyDropsAmount =
          await reservoir.calculateTaxedBnbToTokenLiquidity(
            (this.buyAmount * 10 ** 18).toString()
          )
        this.buyDropsAmount = dripUtils
          .convertFromWei(buyDropsAmount)
          .toFixed(4)
      }
    )
    this.updater()
  },
  setup() {
    const rewards = ref(0)
    const buyAmount = ref(0)
    const buyDropsAmount = ref('0.0000')
    const bnbBalance = ref(0)
    const isReady = ref(false)

    return { rewards, isReady, buyAmount, buyDropsAmount, bnbBalance }
  }
})
</script>
