<template>
  <div class="box flex-box">
    <div class="intro-x flex items-center h-10 ml-5">
      <h2 class="text-lg font-medium truncate mr-5 mt-3">Your stats</h2>
    </div>
    <div class="flex flex-row">
      <div class="px-8 py-4 flex flex-1 mt-2">
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <div class="text-gray-600 dark:text-gray-600 text-xs">
              <strong>REWARDS</strong>
            </div>
            <div class="relative text-3xl font-medium align-text-bottom">
              {{ rewards }}
            </div>
          </div>
          <div>
            <div class="text-gray-600 dark:text-gray-600 text-xs">
              STAKE (%)
            </div>
            <div class="relative text-3xl font-medium">{{ share }} %</div>
          </div>

          <div>
            <div class="text-gray-600 dark:text-gray-600 text-xs mt-2">
              TOTAL <strong>DROPS</strong>
            </div>
            <div class="relative text-3xl font-medium">{{ drops }}</div>
          </div>
          <div>
            <div class="text-gray-600 dark:text-gray-600 text-xs mt-2">
              <strong>BNB</strong> EQUIVALENCE
            </div>
            <div class="relative text-3xl font-medium">{{ dropsBnbValue }}</div>
          </div>
        </div>
      </div>
      <div
        class="
          px-8
          py-4
          flex flex-col
          justify-center
          flex-1
          border-t
          sm:border-t-0 sm:border-l
          border-gray-300
          dark:border-dark-5
          border-dashed
        "
      >
        <div class="text-gray-600 dark:text-gray-600 text-xs">
          BNB/DROP RATIO
        </div>
        <div class="mt-1.5 flex items-center">
          <div class="text-base">
            {{ bnbDropRatio }} <small>BNB per DROPS</small>
          </div>
        </div>
        <div class="text-gray-600 dark:text-gray-600 text-xs mt-5">
          TOTAL INVESTED/WITHDRAWN (BNB)
        </div>
        <div class="mt-1.5 flex items-center">
          <div class="text-base">{{ invested }} / {{ withdrawn }}</div>
        </div>
        <div class="text-gray-600 dark:text-gray-600 text-xs mt-5">
          COMPOUNDS / TOTAL (BNB)
        </div>
        <div class="mt-1.5 flex items-center">
          <div class="text-base">{{ xCompounded }}x / {{ reinvested }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, watch, ref, computed } from 'vue'
import store from '@/store'
import smManager from '@/smartcontracts/smartcontracts-manager'
import dripUtils from '@/smartcontracts/drip-utils'

export default defineComponent({
  components: {},
  async mounted() {
    this.updater = async function () {
      var currentUserAddress = store.state.main.userAddress
      if (!currentUserAddress) {
        return
      }
      const reservoir = await smManager.getReservoirContract()

      // const bnbFiatPrice = await dripUtils.calcBNBPrice()
      const bnbDropRatio = dripUtils.convertFromWei(
        await reservoir.calculateBnbDropRatio()
      )
      const userStats = await reservoir.getUserStats(currentUserAddress)
      const drops = dripUtils.convertFromWei(userStats.balanceOf)
      const totalSupply = await reservoir.getTotalSupply()
      const share = (userStats.balanceOf / totalSupply) * 100
      const rewardsInDrops = await reservoir.getRewards(currentUserAddress)
      const rewardsInBnb = dripUtils.convertFromWei(
        await reservoir.calculateLiquidityToBnb(rewardsInDrops)
      )
      const estDailyRewardBnb = dripUtils.convertFromWei(
        userStats.dailyEstimateBnb
      )
      const xCompounded = userStats.xReinvested
      const reinvested = dripUtils.convertFromWei(userStats.reinvested)
      const invested = dripUtils.convertFromWei(userStats.invested)
      const withdrawn = dripUtils.convertFromWei(userStats.withdrawn)
      withdrawn

      this.bnbDropRatio = bnbDropRatio.toFixed(4)
      this.drops = drops.toFixed(4)
      this.dropsBnbValue = (drops * bnbDropRatio).toFixed(3)
      this.share = share.toFixed(4)
      this.rewards = rewardsInBnb.toFixed(4)
      this.estDailyRewardBnb = estDailyRewardBnb.toFixed(4)
      this.xCompounded = xCompounded
      this.reinvested = reinvested.toFixed(4)
      this.invested = invested.toFixed(4)
      this.withdrawn = withdrawn.toFixed(4)
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
    const drops = ref(0)
    const rewards = ref(0)
    const bnbDropRatio = ref(0)
    const share = ref(0)
    const dropsBnbValue = ref(0)
    const estDailyRewardBnb = ref(0)
    const xCompounded = ref(0)
    const reinvested = ref(0)
    const invested = ref(0)
    const withdrawn = ref(0)
    return {
      drops,
      rewards,
      bnbDropRatio,
      share,
      dropsBnbValue,
      estDailyRewardBnb,
      xCompounded,
      reinvested,
      invested,
      withdrawn
    }
  }
})
</script>
