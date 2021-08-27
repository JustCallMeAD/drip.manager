<template>
  <div class="grid grid-cols-12 gap-6">
    <div class="col-span-12 2xl:col-span-9">
      <div class="grid grid-cols-12 gap-6">
        <!-- BEGIN: General -->
        <div class="col-span-12 mt-8">
          <!-- <div class="intro-y flex items-center h-10">
            <h2 class="text-lg font-medium truncate mr-5">Faucet</h2>
          </div> -->
          <div class="grid grid-cols-12 gap-6 mt-2">
            <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
              <div class="report-box zoom-in">
                <div class="box p-5">
                  <div class="flex">
                    <DatabaseIcon class="report-box__icon text-theme-10" />
                    <div class="text-base text-gray-600 mt-1">
                      &nbsp;Available
                    </div>
                  </div>
                  <div class="text-3xl font-medium leading-8 mt-6">
                    {{ claimsAvailable }}
                  </div>
                  <div
                    class="text-base text-gray-600 mt-1"
                    style="font-size: 1em"
                  >
                    {{ claimsAvailableToFiat }} $ /
                    {{ claimsAvailableToBnb }} BNB
                  </div>
                </div>
              </div>
            </div>
            <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
              <div class="report-box zoom-in">
                <div class="box p-5">
                  <div class="flex">
                    <LockIcon class="report-box__icon text-theme-11" />
                    <div class="text-base text-gray-600 mt-1">
                      &nbsp;Deposits
                    </div>
                  </div>
                  <div class="text-3xl font-medium leading-8 mt-6">
                    {{ deposits }}
                  </div>
                  <div
                    class="text-base text-gray-600 mt-1"
                    style="font-size: 1em"
                  >
                    {{ depositsToFiat }} $ / {{ depositsToBnb }} BNB
                  </div>
                </div>
              </div>
            </div>
            <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
              <div class="report-box zoom-in">
                <div class="box p-5">
                  <div class="flex">
                    <ShoppingCartIcon class="report-box__icon text-theme-12" />
                    <div class="text-base text-gray-600 mt-1">
                      &nbsp;Claimed
                    </div>
                  </div>
                  <div class="text-3xl font-medium leading-8 mt-6">
                    {{ claimed }}
                  </div>
                  <div class="progress h-4 rounded mt-3">
                    <div
                      class="progress-bar bg-theme-1 rounded"
                      :style="claimedProgressStyle"
                      role="progressbar"
                      aria-valuenow="0"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
              <div class="report-box zoom-in">
                <div class="box p-5">
                  <div class="flex">
                    <AlertOctagonIcon class="report-box__icon text-theme-9" />
                    <div class="text-base text-gray-600 mt-1">
                      &nbsp;Max Payout
                    </div>
                  </div>
                  <div class="text-3xl font-medium leading-8 mt-6">
                    {{ maxPayout }}
                  </div>
                  <div class="progress h-4 rounded mt-3">
                    <div
                      class="progress-bar bg-theme-1 rounded"
                      :style="maxPayoutProgressStyle"
                      role="progressbar"
                      aria-valuenow="0"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- END: General Report -->
        <!-- BEGIN: Price stats and actions -->
        <div class="col-span-12 lg:col-span-4 mt-2">
          <div class="intro-y block sm:flex items-center h-10">
            <h2 class="text-lg font-medium truncate mr-5">Price stats</h2>
          </div>
          <div class="intro-y box p-5 mt-12 sm:mt-2">
            <div class="flex flex-col xl:flex-row xl:items-center">
              <div class="flex">
                <div>
                  <div
                    class="
                      text-theme-19
                      dark:text-gray-300
                      text-lg
                      xl:text-xl
                      font-medium
                    "
                  >
                    {{ dripFiatValue }}$
                  </div>
                  <div class="mt-0.5 text-gray-600 dark:text-gray-600">
                    PER DRIP
                  </div>
                </div>
                <div
                  class="
                    w-px
                    h-12
                    border border-r border-dashed border-gray-300
                    dark:border-dark-5
                    mx-4
                    xl:mx-5
                  "
                ></div>

                <div>
                  <div
                    class="
                      text-theme-19
                      dark:text-gray-300
                      text-lg
                      xl:text-xl
                      font-medium
                    "
                  >
                    {{ dripBnbRatio }}
                  </div>
                  <div class="mt-0.5 text-gray-600 dark:text-gray-600">
                    BNB/DRIP
                  </div>
                </div>
                <div
                  class="
                    w-px
                    h-12
                    border border-r border-dashed border-gray-300
                    dark:border-dark-5
                    mx-4
                    xl:mx-5
                  "
                ></div>

                <div>
                  <div
                    class="
                      text-theme-19
                      dark:text-gray-300
                      text-lg
                      xl:text-xl
                      font-medium
                    "
                  >
                    {{ bnbFiatValue }}$
                  </div>
                  <div class="mt-0.5 text-gray-600 dark:text-gray-600">
                    USD/BNB
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-span-12 lg:col-span-4 mt-12 intro-y">
          <button
            :disabled="contractCall || isBuddyRequired"
            @click="hydrate"
            class="btn btn-primary w-32 mr-2 mb-2"
          >
            <RefreshCwIcon class="w-4 h-4 mr-2" /> Hydrate
          </button>
          <button
            :disabled="contractCall || isBuddyRequired"
            @click="claim"
            class="btn btn-primary w-32 mr-2 mb-2"
          >
            <DollarSignIcon class="w-4 h-4 mr-2" /> Claim
          </button>
        </div>
        <!-- END: Price charts -->
      </div>
    </div>
    <div class="col-span-12 2xl:col-span-9">
      <Message severity="success">Welcome to PrimeVue</Message>
      <ProgressBar value="10" />
    </div>
  </div>

</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import smManager from '@/smartcontracts/smartcontracts-manager'
import authManager from '@/auth/auth-manager'
import dripUtils from '@/smartcontracts/drip-utils'
import Message from 'primevue/message'
import ProgressBar from 'primevue/progressbar'

const widthStyle = 'width: [pct]%'

let isUpdating = false

export default defineComponent({
  components: { Message, ProgressBar },
  async mounted() {
    const faucet = await smManager.getFaucetContract(
      authManager.getCurrentUserAddress()
    )

    const fountain = await smManager.getFountainContract()

    const self = this

    const buddyAddress = await faucet.getBuddyAddress()
    if (!buddyAddress || buddyAddress === '') {
      this.isBuddyRequired = true
    } else {
      this.isBuddyRequired = false
    }

    this.hydrate = async function () {
      self.contractCall = true
      faucet
        .hydrate()
        .then(() => {
          alert('Hydrate successful')
        })
        .then(updater)
        .catch((e) => {
          alert(JSON.stringify(e))
        })
        .finally(() => {
          self.contractCall = false
        })
    }

    this.claim = async function () {
      self.contractCall = true
      faucet
        .claim()
        .then(() => {
          alert('Claim successful')
        })
        .then(updater)
        .catch((e) => {
          alert(JSON.stringify(e))
        })
        .finally(() => {
          self.contractCall = false
        })
    }

    const updater = async function () {
      if (isUpdating || self.isBuddyRequired) {
        return Promise.resolve()
      }

      try {
        isUpdating = true

        const oneBilion = 1000000000
        const nbOfDripForOneMilionBnb = await fountain.getTokenToBnbOutputPrice(
          oneBilion
        )

        const bnbFiatValue = await dripUtils.calcBNBPrice()
        const dripBnbRatio = oneBilion / nbOfDripForOneMilionBnb
        const dripFiatValue = dripBnbRatio * bnbFiatValue

        self.bnbFiatValue = bnbFiatValue.toFixed(2)
        self.dripBnbRatio = dripBnbRatio.toFixed(6)
        self.dripFiatValue = dripFiatValue.toFixed(2)

        // AVAILABLE
        const unformattedClaimsAvailable = await faucet.getClaimsAvailable()
        self.claimsAvailable = unformattedClaimsAvailable.toFixed(3)
        self.claimsAvailableToBnb = (
          unformattedClaimsAvailable * dripBnbRatio
        ).toFixed(3)
        self.claimsAvailableToFiat = (
          dripFiatValue * unformattedClaimsAvailable
        ).toFixed(3)

        // DEPOSITS
        const unformattedDeposits = await faucet.getDepositBalance()
        self.deposits = unformattedDeposits.toFixed(3)
        self.depositsToBnb = (unformattedDeposits * dripBnbRatio).toFixed(3)
        self.depositsToFiat = (unformattedDeposits * dripFiatValue).toFixed(3)

        // CLAIMED & MAX PAYOUT
        const unformattedClaimed = await faucet.getClaimedAmount()
        const unformattedMaxPayout = await faucet.getMaxPayout()

        self.claimed = unformattedClaimed.toFixed(3)
        const claimedProgress = (
          (unformattedClaimed / unformattedMaxPayout) *
          100
        ).toFixed(0)

        self.claimedProgressStyle = computed(() => {
          return widthStyle.replace('[pct]', claimedProgress)
        })

        self.maxPayout = unformattedMaxPayout.toFixed(3)
        const maxPayoutProgress = (
          (unformattedMaxPayout / 100000) *
          100
        ).toFixed(0)
        self.maxPayoutProgressStyle = computed(() => {
          return widthStyle.replace('[pct]', maxPayoutProgress)
        })
      } finally {
        isUpdating = false
      }
    }

    // Trigger first update
    await updater()

    // Then call every 10 seconds
    this.$nextTick(() => {
      this.updater = setInterval(async () => {
        updater()
      }, 10000)
    })
  },
  unmounted() {
    // When leaving the current menu, stop calling the updater
    clearInterval(this.updater)
  },
  setup() {
    const claimsAvailable = ref('0')
    const claimsAvailableToFiat = ref('0')
    const claimsAvailableToBnb = ref('0')

    const deposits = ref('0')
    const depositsToFiat = ref('0')
    const depositsToBnb = ref('0')

    const claimed = ref('0')
    const maxPayout = ref('0')

    const dripFiatValue = ref('0')
    const dripBnbRatio = ref('0')
    const bnbFiatValue = ref('0')

    const claimedProgressStyle = computed(() => {
      return widthStyle.replace('[pct]', '0')
    })

    const maxPayoutProgressStyle = computed(() => {
      return widthStyle.replace('[pct]', '0')
    })

    const hydrate = async function () {}
    const claim = async function () {}

    const contractCall = ref(false)
    const isBuddyRequired = ref(true)

    return {
      dripFiatValue,
      dripBnbRatio,
      bnbFiatValue,
      claimsAvailable,
      claimsAvailableToFiat,
      claimsAvailableToBnb,
      deposits,
      depositsToFiat,
      depositsToBnb,
      claimed,
      maxPayout,
      claimedProgressStyle,
      maxPayoutProgressStyle,
      contractCall,
      isBuddyRequired,
      hydrate,
      claim
    }
  }
})
</script>
