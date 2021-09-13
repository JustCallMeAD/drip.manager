<template>
  <div class="grid grid-cols-12 gap-12">
    <div class="intro-y col-span-12 lg:col-span-6 mt-6">
      <!-- BEGIN: Input -->
      <div class="intro-y box mx-auto" style="width: 350px">
        <div
          class="
            flex flex-col
            sm:flex-row
            items-center
            p-5
            border-b-2 border-gray-200
            dark:border-dark-6
          "
        >
          <div class="flex flex-col items-center">
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
                  {{ dripFiatValue ? dripFiatValue.toFixed(2) : 0 }}$
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
                  {{ dripBnbRatio ? dripBnbRatio.toFixed(6) : 0 }}
                </div>
                <div
                  class="
                    mt-0.5
                    text-gray-600
                    dark:text-gray-600
                    flex
                    items-center
                  "
                >
                  <div>BNB/DRIP</div>
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
                  {{ bnbFiatValue ? bnbFiatValue.toFixed(2) : 0 }}$
                </div>
                <div class="mt-0.5 text-gray-600 dark:text-gray-600">
                  USD/BNB
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="
            flex flex-row
            items-center
            p-5
            border-b-2 border-gray-200
            dark:border-dark-6
          "
        >
          <h1 class="font-medium text-base mr-auto">Exchange</h1>
          <div class="mt-3 sm:mt-0">
            <div class="dropdown inline-block" data-placement="bottom-start">
              <a
                href="javascript:"
                class="dropdown-toggle"
                aria-expanded="false"
                ><SettingsIcon
              /></a>

              <div class="dropdown-menu">
                <div class="dropdown-menu__content box p-5">
                  <div class="block">
                    <h2 span class="text-gray-700 whitespace-nowrap">
                      Slippage tolerance:
                    </h2>
                    <div class="mt-2">
                      <div>
                        <label class="inline-flex items-center">
                          <input
                            type="radio"
                            class="form-radio h-4 w-4"
                            name="slippage"
                            value="1"
                            data-dismiss="dropdown"
                            v-model="slippage"
                            :checked="slippage == 1"
                          />
                          <span class="ml-2">1%</span>
                        </label>
                      </div>
                      <div class="mt-1">
                        <label class="inline-flex items-center">
                          <input
                            type="radio"
                            class="form-radio h-4 w-4"
                            name="slippage"
                            value="3"
                            data-dismiss="dropdown"
                            v-model="slippage"
                            :checked="slippage == 3"
                          />
                          <span class="ml-2">3%</span>
                        </label>
                      </div>
                      <div class="mt-1">
                        <label class="inline-flex items-center">
                          <input
                            type="radio"
                            class="form-radio h-4 w-4"
                            name="slippage"
                            value="5"
                            v-model="slippage"
                            data-dismiss="dropdown"
                            :checked="slippage == 5"
                          />
                          <span class="ml-2">5%</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-row ml-3 mt-4 mr-5">
          <h2 class="font-extrabold">FROM:</h2>
        </div>

        <div class="border-2 rounded-lg p-2 ml-1 mr-1">
          <div class="flex flex-row ml-3 mt-1 mr-5">
            <div class="mr-auto font-medium">≈ {{ fromCoinFiatValue }} $</div>
            <div class="flex-shrink-0">
              {{ fromBalance }} {{ ' ' + fromCoin }}
            </div>
          </div>
          <div class="flex flex-row items-center ml-3 mr-3 mt-1">
            <input
              id="fromAmountInput"
              type="number"
              min="0"
              class="form-control"
              placeholder="0.0000"
              style="
                border-width: 0.5px;
                box-shadow: none;
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
              "
              v-model="fromAmount"
            />
            <button
              class="btn btn-secondary"
              @click="setFromMax"
              style="border-top-left-radius: 0; border-bottom-left-radius: 0"
            >
              MAX
            </button>
          </div>
        </div>

        <div class="flex flex-row ml-3 mt-8 mr-5">
          <div class="mr-auto"></div>
          <div class="">
            <a href="javascript:;"
              ><RefreshCcwIcon @click="changeOrientation"
            /></a>
          </div>
          <div class="mr-auto"></div>
        </div>
        <div class="flex flex-row ml-3 mt-6 mr-5">
          <h2 class="font-extrabold">TO:</h2>
        </div>
        <div class="flex flex-row mt-1 ml-3 mt-1 mr-5">
          <div class="mr-auto font-medium">≈ {{ toCoinFiatValue }} $</div>
          <div class="flex-shrink-0">{{ toBalance }} {{ ' ' + toCoin }}</div>
        </div>
        <div class="flex flex-row items-center ml-3 mr-3 mt-1">
          <a
            id="toAmountInput"
            class="form-control"
            placeholder="0.0000"
            style="box-shadow: none"
            >{{ toAmount }}</a
          >
        </div>
        <div
          v-if="toMinAmount > 0"
          class="flex flex-row items-center ml-3 mr-3 mt-1"
        >
          Minimum received: {{ toMinAmount }}
          <!-- <RefreshCcwIcon/> -->
        </div>
        <div class="flex flex-row items-center ml-3 mr-3 mt-1">
          Slippage tolerance: {{ slippage }}%
        </div>
        <div class="flex flex-row items-center ml-3 mb-2 mr-3 mt-1">
          * Estimated values only
        </div>
        <div class="p-5 border-t border-gray-200 dark:border-dark-6">
          <button
            :disabled="isWaitingForContractWrite"
            v-if="isFromBnb"
            class="btn btn-success w-full flex flex-row items-center"
            @click="swap"
          >
            Buy DRIP
          </button>
          <button
            :disabled="isWaitingForContractWrite"
            v-else-if="isApproveRequired"
            class="btn btn-danger w-full"
            @click="approve"
          >
            Approve DRIP
          </button>
          <button
            :disabled="isWaitingForContractWrite"
            v-else
            class="btn btn-danger w-full"
            @click="swap"
          >
            Sell DRIP
          </button>
          <button
            :disabled="isWaitingForContractWrite"
            v-if="dripBalance > 0"
            class="btn btn-warning w-full flex flex-row items-center mt-2"
            @click="depositAll"
          >
            Deposit {{ dripBalance }} DRIP
          </button>
        </div>
      </div>
      <!-- END: Input -->
    </div>
    <!-- <div class="intro-y col-span-12 lg:col-span-6 mt-6">
      <DripTradingView />
    </div> -->
  </div>
</template>

<script>
import { defineComponent, ref, watch, computed } from 'vue'
import smManager from '@/smartcontracts/smartcontracts-manager'
import dripUtils from '@/smartcontracts/drip-utils'
import store from '@/store'
// import DripTradingView from '@/views/fountain-tradeview/Main.vue'

export default defineComponent({
  components: {},
  methods: {
    setFromMax: function (event) {
      if (this.isFromBnb) {
        this.fromAmount = this.bnbBalance - 0.01
        this.fromAmount = this.fromAmount > 0 ? this.fromAmount : 0
      } else {
        this.fromAmount = this.dripBalance
        this.fromAmount = this.fromAmount > 0 ? this.fromAmount : 0
      }
    },
    swap: async function (event) {
      this.triggerSwap()
    },
    approve: async function () {
      this.triggerApprove()
    },
    depositAll: async function () {
      this.triggerDepositAll()
    },
    changeOrientation: function () {
      this.isFromBnb = !this.isFromBnb
      this.fromAmount = 0
      this.toAmount = 0
      this.updateCoinValues()
    }
  },
  async mounted() {
    const fountain = await smManager.getFountainContract()
    const drip = await smManager.getDripContract()
    const faucet = await smManager.getFaucetContract()

    const self = this
    this.fountain = fountain
    var currentUserAddress = store.state.main.userAddress

    this.updateCoinValues = function () {
      if (!currentUserAddress) {
        return
      }
      if (self.isFromBnb) {
        self.fromCoin = 'BNB'
        self.fromBalance = self.bnbBalance
        self.fromCoinFiatValue = (self.bnbBalance * self.bnbFiatValue).toFixed(
          6
        )
        self.toCoin = 'DRIP'
        self.toBalance = self.dripBalance
        self.toCoinFiatValue = (self.dripBalance * self.dripFiatValue).toFixed(
          6
        )
      } else {
        self.toCoin = 'BNB'
        self.toBalance = self.bnbBalance
        self.toCoinFiatValue = (self.bnbBalance * self.bnbFiatValue).toFixed(6)
        self.fromCoin = 'DRIP'
        self.fromBalance = self.dripBalance
        self.fromCoinFiatValue = (
          self.dripBalance * self.dripFiatValue
        ).toFixed(6)
      }
    }

    this.triggerSwap = async function () {
      try {
        self.isWaitingForContractWrite = true
        const minAmount = (self.toMinAmount * 10 ** 18).toString()
        const fromAmount = (self.fromAmount * 10 ** 18).toString()
        if (self.isFromBnb) {
          await fountain.bnbToTokenSwapInput(
            fromAmount,
            minAmount,
            currentUserAddress
          )
        } else {
          await fountain.tokenToBnbSwapInput(
            fromAmount,
            minAmount,
            currentUserAddress
          )
        }
        alert('Swap completed')
      } catch (e) {
        alert(e.message)
      } finally {
        self.isWaitingForContractWrite = false
      }
    }

    this.triggerApprove = async function () {
      try {
        self.isWaitingForContractWrite = true
        await drip.setAllowance(currentUserAddress)
        self.isWaitingForContractWrite = false
        self.isApproveRequired = false
        alert('Approved successfully')
      } catch (e) {
        alert(e.message)
      } finally {
        self.isWaitingForContractWrite = false
      }
    }

    this.triggerDepositAll = async function () {
      try {
        self.isWaitingForContractWrite = true
        await faucet.deposit(
          currentUserAddress,
          (self.dripBalance * 10 ** 18).toString()
        )
        self.isWaitingForContractWrite = false
        self.isApproveRequired = false
        alert('Deposit successfully')
      } catch (e) {
        alert(e.message)
      } finally {
        self.isWaitingForContractWrite = false
      }
    }

    this.isUpdating = false
    this.update = async function () {
      if (self.isUpdating || !currentUserAddress) {
        return
      }

      try {
        const one = 1 * 10 ** 18
        const nbOfDripForOneBnb = await fountain.getTokenToBnbOutputPrice(
          one.toString()
        )

        self.isApproveRequired = !(
          (await drip.getAllowance(currentUserAddress)) > 0
        )

        self.bnbFiatValue = await dripUtils.calcBNBPrice()
        self.dripBnbRatio = one / nbOfDripForOneBnb
        self.dripFiatValue = self.dripBnbRatio * self.bnbFiatValue
        self.bnbBalance = await smManager.getBnbBalanceOf(currentUserAddress)
        self.dripBalance =
          (await drip.getDripBalanceOf(currentUserAddress)) / 10 ** 18
        self.dripBalance = self.dripBalance < 0.000001 ? 0.0 : self.dripBalance
        self.updateCoinValues()

        self.buddyAddress = await faucet.getBuddyAddress(currentUserAddress)
      } catch (e) {
        setTimeout(this.updater, 2000)
        console.error(e)
      } finally {
        self.isUpdating = false
      }
    }

    this.update()
    this.updater = setInterval(this.update, 10000)

    watch(
      computed(() => store.state.main.userAddress),
      () => {
        currentUserAddress = store.state.main.userAddress
        this.fromAmount = 0
        this.toAmount = 0
        this.update()
      }
    )
  },
  unmounted() {
    clearInterval(this.updater)
  },

  setup() {
    const fromCoin = ref('BNB')
    const toCoin = ref('DRIP')
    const fromAmount = ref(null)
    const toAmount = ref(0.0)
    const toMinAmount = ref(0.0)
    const fromCoinFiatValue = ref(0)
    const toCoinFiatValue = ref(0)
    const fromBalance = ref(0)
    const toBalance = ref(0)
    const isFromBnb = ref(true)

    const dripFiatValue = ref(0)
    const dripBnbRatio = ref(0)
    const bnbFiatValue = ref(0)

    const slippage = ref(3)
    const isApproveRequired = ref(false)

    const isWaitingForContractWrite = ref(false)

    const dripBalance = ref(0)

    // var tokenUpdate
    return {
      dripBalance,
      fromAmount,
      toAmount,
      toMinAmount,
      fromBalance,
      toBalance,
      fromCoin,
      toCoin,
      fromCoinFiatValue,
      toCoinFiatValue,
      dripFiatValue,
      dripBnbRatio,
      bnbFiatValue,
      slippage,
      isApproveRequired,
      isWaitingForContractWrite,
      isFromBnb
    }
  },
  watch: {
    fromAmount: async function (value) {
      if (value == undefined || value == '' || value == 0) {
        this.toAmount = 0
        this.toMinAmount = 0
        return
      }
      if (this.tokenUpdate) clearTimeout(this.tokenUpdate)
      this.tokenUpdate = setTimeout(async () => {
        if (this.isFromBnb) {
          const theValue = await this.fountain.getBnbToTokenInputPrice(
            (value * 10 ** 18).toString()
          )

          this.toAmount = theValue / 10 ** 18
          this.toMinAmount = this.toAmount * (1 - this.slippage / 100)
        } else {
          const theValue = await this.fountain.getTokenToBnbInputPrice(
            (value * 10 ** 18).toString()
          )
          this.toAmount = (0.9 * theValue) / 10 ** 18
          this.toMinAmount = this.toAmount * (1 - this.slippage / 100)
        }
      }, 500)
    },
    slippage: function (value) {
      if (this.toAmount > 0) {
        this.toMinAmount = this.toAmount * (1 - this.slippage / 100)
      }
    }
  }
})
</script>

<style scoped>
.flex-no-shrink {
  flex-shrink: 0;
}
</style>
