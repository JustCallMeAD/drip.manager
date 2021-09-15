<template>
  <div class="grid grid-cols-12 gap-6">
    <!-- START : BUDDY WARNING -->
    <div v-if="isBuddyRequired" class="col-span-12">
      <div class="col-span-12 mt-2">
        <Message severity="warn" :closable="false">
          A Buddy must be specified to fully utilize the Faucet. Go to the Buddy
          section
        </Message>
      </div>
    </div>
    <!-- END : BUDDY WARNING -->
    <div class="col-span-12">
      <div class="grid grid-cols-12 gap-6">
        <!-- BEGIN: Player stats -->
        <div class="col-span-12 mt-2">
          <!-- <div class="intro-y flex items-center h-10">
            <h2 class="text-lg font-medium truncate mr-5">Faucet</h2>
          </div> -->
          <div class="grid grid-cols-12 gap-6 mt-2">
            <div class="col-span-6 xl:col-span-3 intro-y">
              <div class="report-box zoom-in">
                <div class="box p-5">
                  <div class="flex">
                    <DatabaseIcon class="report-box__icon text-theme-10" />
                    <div class="text-base text-gray-600 mt-1">
                      &nbsp;Available
                    </div>
                  </div>
                  <div class="text-2xl xl:text-3xl font-medium leading-8 mt-6">
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
            <div class="col-span-6 xl:col-span-3 intro-y">
              <div class="report-box zoom-in">
                <div class="box p-5">
                  <div class="flex">
                    <LockIcon class="report-box__icon text-theme-11" />
                    <div class="text-base text-gray-600 mt-1">
                      &nbsp;Deposits
                    </div>
                  </div>
                  <div class="text-2xl xl:text-3xl font-medium leading-8 mt-6">
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
            <div class="col-span-6 xl:col-span-3 intro-y">
              <div class="report-box zoom-in">
                <div class="box p-5">
                  <div class="flex">
                    <ShoppingCartIcon class="report-box__icon text-theme-12" />
                    <div class="text-base text-gray-600 mt-1">
                      &nbsp;Claimed
                    </div>
                  </div>
                  <div class="text-2xl xl:text-3xl font-medium leading-8 mt-6">
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
            <div class="col-span-6 xl:col-span-3 intro-y">
              <div class="report-box zoom-in">
                <div class="box p-5">
                  <div class="flex">
                    <AlertOctagonIcon class="report-box__icon text-theme-9" />
                    <div class="text-base text-gray-600 mt-1 whitespace-nowrap">
                      &nbsp;Max Payout
                    </div>
                  </div>
                  <div class="text-2xl xl:text-3xl font-medium leading-8 mt-6">
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
        <!-- END: Player stats -->
        <!-- BEGIN: Price stats, action buttons and buddy input -->

        <div class="col-span-12 xl:col-span-6 mt-2 intro-y">
          <div class="grid grid-cols-12 gap-6">
            <div class="col-span-12 xl:col-span-8 mt-2 intro-y">
              <div class="intro-y box p-2">
                <div class="flex flex-col xl:flex-row xl:items-center">
                  <div class="flex mx-auto">
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
                        {{ airdropReceived }} / {{ airdropSent }}
                      </div>
                      <div class="mt-0.5 text-gray-600 dark:text-gray-600">
                        Airdrop Received / Sent
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
                        {{ rewardDirect }} / {{ rewardIndirect }}
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
                        <div>Rewarded direct / indirect</div>
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
                        {{ teamDirect }} / {{ teamTotal }}
                      </div>
                      <div class="mt-0.5 text-gray-600 dark:text-gray-600">
                        Team direct / indirect
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-span-12 xl:col-span-4 mt-2 intro-y">
              <div class="intro-y box p-2">
                <div class="flex flex-col items-center">
                  <div class="dark:text-gray-300">Wallet balance</div>
                  <div class="text-theme-19 dark:text-gray-300 font-medium">
                    {{ dripBalance.toFixed(6) }} DRIP
                  </div>
                  <div class="flex flex-nowrap">
                    <button
                      @click="depositAll"
                      :disabled="dripBalance == 0"
                      class="btn btn-secondary whitespace-nowrap"
                      style="
                        border-top-right-radius: 0;
                        border-bottom-right-radius: 0;
                      "
                    >
                      Deposit ALL
                    </button>
                    <button
                      :disabled="dripBalance == 0"
                      @click="$refs.faucetDepositDropDown.show2()"
                      class="btn btn-secondary whitespace-nowrap"
                      style="
                        border-top-left-radius: 0;
                        border-bottom-left-radius: 0;
                      "
                    >
                      Deposit...
                    </button>
                    <FaucetDepositDropDown ref="faucetDepositDropDown" />
                  </div>
                </div>
              </div>
            </div>
            <!-- <div class="col-span-12 intro-y">
              <h2 class="text-lg font-medium truncate mr-5">Price stats</h2>
            </div> -->
            <div class="col-span-12 xl:col-span-8 intro-y">
              <div class="intro-y box p-2">
                <div class="flex flex-col xl:flex-row xl:items-center">
                  <div class="flex mx-auto">
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
                      <div class="flex items-center">
                        <div class="mt-0.5 text-gray-600 dark:text-gray-600">
                          24H Change:
                        </div>
                        <Tippy
                          v-if="dripBnbRatio24hChange >= 0"
                          tag="div"
                          class="
                            text-theme-9
                            flex
                            text-sm
                            font-large
                            cursor-pointer
                            ml-1
                          "
                          content="Change in the last 24 hours"
                        >
                          {{ dripBnbRatio24hChange }}%
                          <ChevronUpIcon class="w-4 h-4 ml-0.5" />
                        </Tippy>
                        <Tippy
                          v-else
                          tag="div"
                          class="
                            text-theme-6
                            flex
                            text-sm
                            font-large
                            cursor-pointer
                            ml-1
                          "
                          content="Change in the last 24 hours"
                        >
                          {{ dripBnbRatio24hChange }}%
                          <ChevronDownIcon class="w-4 h-4 ml-0.5" />
                        </Tippy>
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
            <!-- ACTION BUTTON -->
            <div class="col-span-12 xl:col-span-4 intro-y">
              <div class="flex flex-wrap">
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
                <PlayerLookupModal />
              </div>
            </div>
            <!-- END: ACTION BUTTON-->
            <!-- BEGIN: BUDDY INPUT -->
            <div class="col-span-12">
              <div class="grid grid-cols-2 gap-3">
                <div class="col-span-2 mt-2 intro-y">
                  <h2 class="text-lg font-medium truncate mr-5">Buddy</h2>
                </div>
                <div class="col-span-2 xl:col-span-2">
                  <div
                    class="intro-y box"
                    v-bind:class="{ required: isBuddyRequired }"
                  >
                    <div id="input" class="p-5">
                      <div>
                        <div class="mt-3">
                          <label for="regular-form-3" class="form-label"
                            >Buddy Address</label
                          >
                          <input
                            id="regular-form-3"
                            :disabled="isBuddySpecified || !isBuddyRequired"
                            type="text"
                            class="form-control"
                            placeholder="0x0000000000000000000000000000000000000000"
                            v-model="inputBuddyAddress"
                          />
                          <div class="form-help">
                            Enter your buddy address here.
                          </div>
                        </div>
                        <div v-if="isBuddySpecified" class="mt-3">
                          <label for="regular-form-4" class="form-label"
                            >Airdrop Sent</label
                          >
                          <div class="input-group">
                            <input
                              id="regular-form-4"
                              :disabled="true"
                              type="text"
                              class="form-control"
                              :value="buddyAirdropSent"
                            />
                            <div
                              id="input-group-price"
                              class="input-group-text"
                            >
                              Drips
                            </div>
                          </div>
                        </div>
                        <div v-if="isBuddySpecified" class="mt-3">
                          <label for="regular-form-5" class="form-label"
                            >Airdrop Received</label
                          >
                          <div class="input-group">
                            <input
                              id="regular-form-5"
                              :disabled="true"
                              type="text"
                              class="form-control"
                              :value="buddyAirdropReceived"
                            />
                            <div
                              id="input-group-price"
                              class="input-group-text"
                            >
                              Drips
                            </div>
                          </div>
                        </div>
                        <div v-if="isBuddySpecified" class="mt-3">
                          <label for="regular-form-6" class="form-label"
                            >Total Deposits</label
                          >
                          <div class="input-group">
                            <input
                              id="regular-form-6"
                              :disabled="true"
                              type="text"
                              class="form-control"
                              :value="buddyTotalDeposits"
                            />
                            <div
                              id="input-group-price"
                              class="input-group-text"
                            >
                              Drips
                            </div>
                          </div>
                        </div>
                        <Message
                          v-if="isBuddySpecified && isBuddyRequired"
                          severity="warn"
                          :closable="false"
                        >
                          Your buddy is set for life, choose it wisely!
                        </Message>
                        <button
                          v-if="!isBuddySpecified && isBuddyRequired"
                          class="btn btn-primary mt-5"
                          @click="previewBuddy"
                        >
                          Next
                        </button>
                        <button
                          v-if="isBuddySpecified && isBuddyRequired"
                          class="btn btn-primary mt-5"
                          @click="confirmBuddy"
                        >
                          Confirm</button
                        >&nbsp;
                        <button
                          v-if="isBuddySpecified && isBuddyRequired"
                          ref="cancelBuddy"
                          class="btn btn-secondary mt-5"
                          @click="cancelBuddy"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- END: BUDDY INPUT -->
          </div>
        </div>
        <!-- END: Price stats, action buttons and buddy input -->

        <!-- BEGIN: Global statistics -->
        <div class="col-span-12 xl:col-span-3 intro-y">
          <ReportPieChartDeposits :height="250" class="mt-3" />
        </div>
        <div class="col-span-12 xl:col-span-3 intro-y">
          <div class="box p-5 mt-3">
            <div class="flex">
              <div class="text-base text-gray-600 mt-1">
                &nbsp;Other statistics comming soon
                <div class="progress">
                  <div
                    class="progress-bar w-1/2 bg-theme-1"
                    role="progressbar"
                    aria-valuenow="0"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <div class="progress mt-3">
                  <div
                    class="progress-bar w-2/3 bg-theme-1"
                    role="progressbar"
                    aria-valuenow="0"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <div class="progress mt-3">
                  <div
                    class="progress-bar w-3/4 bg-theme-1"
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
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch } from 'vue'
import smManager from '@/smartcontracts/smartcontracts-manager'
import dripUtils from '@/smartcontracts/drip-utils'
import Message from 'primevue/message'
import ReportPieChartDeposits from '@/components/report-pie-chart-deposits/Main.vue'
import PlayerLookupModal from '@/views/faucet-player-lookup-modal/Main.vue'
import FaucetDepositDropDown from '@/views/faucet-deposit/Main.vue'
import store from '@/store'
const decimals = 10 ** 18

const widthStyle = 'width: [pct]%'

let isUpdating = false

export default defineComponent({
  components: {
    Message,
    ReportPieChartDeposits,
    PlayerLookupModal,
    FaucetDepositDropDown
  },
  async mounted() {
    try {
      const fountain = await smManager.getFountainContract()

      const self = this

      this.updateBuddySection = async function () {
        if (!store.state.main.userAddress) {
          return Promise.resolve()
        }
        const faucet = await smManager.getFaucetContract()
        const userInfo = await faucet.queryFaucetGlobalUserInfo(
          store.state.main.userAddress
        )
        const buddyAddress = userInfo.upline
        if (
          !buddyAddress ||
          buddyAddress === '0x0000000000000000000000000000000000000000'
        ) {
          self.isBuddyRequired = true
        } else {
          self.isBuddyRequired = false

          const buddyUserInfo = await faucet.queryFaucetGlobalUserInfo(
            buddyAddress
          )

          self.isBuddySpecified = true
          self.inputBuddyAddress = buddyAddress
          self.buddyAirdropSent = buddyUserInfo.airdrops_total.toFixed(3)
          self.buddyAirdropReceived = buddyUserInfo.airdrops_received.toFixed(3)
          self.buddyTotalDeposits = buddyUserInfo.total_deposits.toFixed(3)
        }
      }

      // BEGIN: Buddy section actions
      this.previewBuddy = async function () {
        if (!self.inputBuddyAddress) {
          alert('Buddy Address field is required')
          return Promise.resolve()
        }

        const faucet = await smManager.getFaucetContract()
        faucet
          .queryFaucetGlobalUserInfo(store.state.main.userAddress)
          .then((userInfoTotals) => {
            self.isBuddySpecified = true

            self.buddyAirdropSent = (
              userInfoTotals.airdrops_total / decimals
            ).toFixed(3)
            self.buddyAirdropReceived = (
              userInfoTotals.airdrops_received / decimals
            ).toFixed(3)
            self.buddyTotalDeposits = (
              userInfoTotals.total_deposits / decimals
            ).toFixed(3)
          })
          .catch((e) => {
            console.error(JSON.stringify(e))
            alert(JSON.stringify(e))
          })
      }

      this.cancelBuddy = function () {
        self.isBuddySpecified = false
        self.inputBuddyAddress = ''
        self.buddyAirdropSent = 0
        self.buddyAirdropReceived = 0
        self.buddyTotalDeposits = 0
      }

      this.confirmBuddy = async function () {
        const currentUserAddress = store.state.main.userAddress
        const buddy = await smManager.getBuddyContract(currentUserAddress)
        return buddy
          .setBuddy(self.inputBuddyAddress)
          .catch((e) => {
            console.error(JSON.stringify(e))
            alert(JSON.stringify(e))
          })
          .finally(() => {})
      }
      // END: Buddy section actions

      // BEGIN: Hydrate/Claim/Deposit All actions
      this.hydrate = async function () {
        self.contractCall = true
        const currentUserAddress = store.state.main.userAddress
        const faucet = await smManager.getFaucetContract()
        faucet
          .hydrate(currentUserAddress)
          .then(() => {
            alert('Hydrate successful')
          })
          .then(this.updater)
          .catch((e) => {
            console.error(JSON.stringify(e))
            alert(JSON.stringify(e))
          })
          .finally(() => {
            self.contractCall = false
          })
      }

      this.claim = async function () {
        self.contractCall = true
        const currentUserAddress = store.state.main.userAddress
        const faucet = await smManager.getFaucetContract()
        faucet
          .claim(currentUserAddress)
          .then(() => {
            alert('Claim successful')
          })
          .then(this.updater)
          .catch((e) => {
            console.error(JSON.stringify(e))
            alert(JSON.stringify(e))
          })
          .finally(() => {
            self.contractCall = false
          })
      }
      this.depositAll = async function () {
        self.contractCall = true
        const currentUserAddress = store.state.main.userAddress
        const drip = await smManager.getDripContract()
        const dripBalance = await drip.getDripBalanceOf(currentUserAddress)
        const faucet = await smManager.getFaucetContract()
        faucet
          .deposit(currentUserAddress, dripBalance.toString())
          .then(() => {
            alert('Deposit successful')
          })
          .then(this.updater)
          .catch((e) => {
            console.error(JSON.stringify(e))
            alert(JSON.stringify(e))
          })
          .finally(() => {
            self.contractCall = false
          })
      }
      // END: Hydrate/Claim/Deposit All actions

      this.updater = async function () {
        if (isUpdating || !store.state.main.userAddress) {
          return Promise.resolve()
        }

        try {
          const faucet = await smManager.getFaucetContract()
          const drip = await smManager.getDripContract()
          const userAddress = store.state.main.userAddress
          const userInfo = await faucet.queryFaucetGlobalUserInfo(userAddress)
          isUpdating = true
          const one = 1 * 10 ** 18
          const nbOfDripForOneBnb = await fountain.getTokenToBnbOutputPrice(
            one.toString()
          )

          const nbOfDripForOneBnb24hAgo =
            await fountain.getTokenToBnbOutputPrice(one.toString(), 24)

          const bnbFiatValue = await dripUtils.calcBNBPrice()
          const dripBnbRatio = one / nbOfDripForOneBnb
          const dripBnbRatio24hAgo = one / nbOfDripForOneBnb24hAgo
          const dripFiatValue = dripBnbRatio * bnbFiatValue

          self.dripBnbRatio24hChange = (
            (100 * (dripBnbRatio - dripBnbRatio24hAgo)) /
            dripBnbRatio
          ).toFixed(2)

          self.bnbFiatValue = bnbFiatValue.toFixed(2)
          self.dripBnbRatio = dripBnbRatio.toFixed(6)
          self.dripFiatValue = dripFiatValue.toFixed(2)

          // AVAILABLE
          const unformattedClaimsAvailable = userInfo.claim_available / decimals
          self.claimsAvailable = unformattedClaimsAvailable.toFixed(3)
          self.claimsAvailableToBnb = (
            unformattedClaimsAvailable * dripBnbRatio
          ).toFixed(3)
          self.claimsAvailableToFiat = (
            dripFiatValue * unformattedClaimsAvailable
          ).toFixed(3)

          // DEPOSITS
          const unformattedDeposits = userInfo.total_deposits
          self.deposits = unformattedDeposits.toFixed(3)
          self.depositsToBnb = (unformattedDeposits * dripBnbRatio).toFixed(3)
          self.depositsToFiat = (unformattedDeposits * dripFiatValue).toFixed(3)

          // CLAIMED & MAX PAYOUT
          const unformattedClaimed = userInfo.total_payouts
          const unformattedMaxPayout =
            userInfo.max_payouts.max_payout / decimals

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

          // AIRDROPS / REWARDS
          self.airdropReceived = userInfo.airdrops_received.toFixed(2)
          self.airdropSent = userInfo.airdrops_total.toFixed(2)

          self.rewardDirect = (userInfo.direct_bonus / decimals).toFixed(2)
          self.rewardIndirect = (userInfo.match_bonus / decimals).toFixed(2)

          self.teamDirect = userInfo.referrals
          self.teamTotal = userInfo.total_structure

          // Drip Balance
          self.dripBalance =
            (await drip.getDripBalanceOf(userAddress)) / 10 ** 18
        } finally {
          isUpdating = false
        }
      }

      watch(
        computed(() => store.state.main.userAddress),
        () => {
          self.updater()
          self.updateBuddySection()
        }
      )

      this.$watch(
        '$refs.faucetDepositDropDown.contractCall',
        (newValue, oldValue) => (this.contractCall = newValue)
      )

      // Trigger first update
      this.updater()
      this.updateBuddySection()

      // Then call every 10 seconds
      this.$nextTick(() => {
        this.updaterInterval = setInterval(async () => {
          this.updater()
        }, 10000)
      })
    } catch (err) {
      console.error(err)
      setTimeout(this.updater, 2000)
    }
  },
  unmounted() {
    // When leaving the current menu, stop calling the updater
    clearInterval(this.updaterInterval)
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
    const dripBnbRatio24hChange = ref('0')
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
    const isBuddyRequired = ref(false)
    const isBuddySpecified = ref(false)
    const inputBuddyAddress = ref('')

    const buddyAirdropSent = ref(0)

    const airdropReceived = ref(0)
    const airdropSent = ref(0)

    const rewardDirect = ref(0)
    const rewardIndirect = ref(0)

    const teamDirect = ref(0)
    const teamTotal = ref(0)

    const dripBalance = ref(0)
    return {
      dripBalance,
      teamDirect,
      teamTotal,
      rewardDirect,
      rewardIndirect,
      airdropReceived,
      airdropSent,
      dripFiatValue,
      dripBnbRatio,
      dripBnbRatio24hChange,
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
      isBuddySpecified,
      inputBuddyAddress,
      buddyAirdropSent,
      hydrate,
      claim
    }
  },
  methods: {}
})
</script>
<style scoped>
.required {
  border: 3px;
  border-style: solid;
  border-color: #ff0000;
}
</style>
