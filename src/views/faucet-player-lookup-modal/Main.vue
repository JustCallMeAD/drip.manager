<template>
  <!-- BEGIN: Header & Footer Slide Over -->

  <div>
    <a
      href="javascript:;"
      data-toggle="modal"
      data-target="#header-footer-slide-over-preview"
      class="btn btn-success w-32 mr-2 mb-2"
      ><SearchIcon class="w-4 h-4 mr-1" />Player Lookup</a
    >
  </div>
  <div id="header-footer-slide-over">
    <!-- BEGIN: Slide Over Toggle -->
    <!-- END: Slide Over Toggle -->
    <!-- BEGIN: Slide Over Content -->
    <div
      id="header-footer-slide-over-preview"
      class="modal modal-slide-over"
      data-backdrop="static"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <a data-dismiss="modal" href="javascript:;">
            <XIcon class="w-8 h-8 text-gray-500" />
          </a>
          <!-- BEGIN: Slide Over Header -->
          <div class="modal-header">
            <h2 class="font-medium text-base mr-auto">Player Lookup</h2>

            <div class="dropdown sm:hidden">
              <a
                class="dropdown-toggle w-5 h-5 block"
                href="javascript:;"
                aria-expanded="false"
              >
                <MoreHorizontalIcon
                  class="w-5 h-5 text-gray-600 dark:text-gray-600"
                />
              </a>
            </div>
          </div>
          <!-- END: Slide Over Header -->
          <!-- BEGIN: Slide Over Body -->
          <div class="modal-body">
            <div>
              <label for="modal-form-1" class="form-label">Address</label>
              <input
                id="modal-form-1"
                type="text"
                class="form-control"
                v-model="playerAddress"
                placeholder="0x0000000000000000000000000000000000000000"
              />
              <button
                type="button"
                @click="lookup"
                class="btn btn-primary w-20 mt-4"
              >
                GO
              </button>
            </div>
            <div id="small-table" class="p-5">
              <div class="overflow-x-auto">
                <table class="table table--sm">
                  <thead>
                    <tr>
                      <th
                        class="border-b-2 dark:border-dark-5 whitespace-nowrap"
                      >
                        Field
                      </th>
                      <th
                        class="border-b-2 dark:border-dark-5 whitespace-nowrap"
                      >
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="value in listResults" :key="value">
                      <td class="border-b dark:border-dark-5">
                        {{ value.field }}
                      </td>
                      <td class="border-b dark:border-dark-5">
                        {{ value.value }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <!-- END: Slide Over Body -->
          <!-- BEGIN: Slide Over Footer -->
          <div class="modal-footer text-right w-full absolute bottom-0">
            <button
              type="button"
              data-dismiss="modal"
              class="btn btn-outline-secondary w-20 mr-1"
            >
              Close
            </button>
          </div>
          <!-- END: Slide Over Footer -->
        </div>
      </div>
    </div>
    <!-- END: Slide Over Content -->
  </div>

  <!-- END: Header & Footer Slide Over -->
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import authManager from '@/auth/auth-manager'
const cloud = authManager.getCloudRunner()
const decimals = 10 ** 18

export default defineComponent({
  methods: {
    lookup: async function () {
      const userInfo = await cloud('queryFaucetGlobalUserInfo', {
        address: this.playerAddress
      })
      while (this.playerLookupResultsRaw.length > 0) {
        this.playerLookupResultsRaw.pop()
      }

      let lastAirdropDays = 'Never'
      if (userInfo.last_airdrop) {
        lastAirdropDays =
          Math.floor(
            (new Date().getTime() / 1000 - userInfo.last_airdrop) /
              (60 * 60 * 24)
          ) + ' Days'
      }
      this.playerLookupResultsRaw.push({
        field: 'Directs',
        value: userInfo.referrals
      })
      this.playerLookupResultsRaw.push({
        field: 'Team',
        value: userInfo.total_structure
      })
      this.playerLookupResultsRaw.push({
        field: 'Total Deposits',
        value: (userInfo.total_deposits / decimals).toFixed(3)
      })
      this.playerLookupResultsRaw.push({
        field: 'Total Hydrates',
        value: (userInfo.rolls / decimals).toFixed(3)
      })
      this.playerLookupResultsRaw.push({
        field: 'Airdrop Sent',
        value: (userInfo.airdrops_total / decimals).toFixed(3)
      })
      this.playerLookupResultsRaw.push({
        field: 'Airdrop Received',
        value: (userInfo.airdrops_received / decimals).toFixed(3)
      })
      this.playerLookupResultsRaw.push({
        field: 'Last Airdrop',
        value: lastAirdropDays
      })
      this.playerLookupResultsRaw.push({
        field: 'Net Deposits',
        value: (
          userInfo.total_deposits / decimals +
          userInfo.airdrops_total / decimals +
          userInfo.rolls / decimals -
          userInfo.total_payouts / decimals
        ).toFixed(3)
      })
    }
  },
  mounted() {},
  setup() {
    const showProgrammaticallyShowSlideOver = () => {
      cash('#programmatically-slide-over').modal('show')
    }
    const hideProgrammaticallyShowSlideOver = () => {
      cash('#programmatically-slide-over').modal('hide')
    }
    const toggleProgrammaticallyShowSlideOver = () => {
      cash('#programmatically-slide-over').modal('toggle')
    }

    const playerAddress = ref(null)
    const playerLookupResultsRaw = ref([])
    const playerLookupResults = computed(() => playerLookupResultsRaw)
    return {
      playerAddress,
      playerLookupResultsRaw,
      listResults: playerLookupResults.value,
      showProgrammaticallyShowSlideOver,
      hideProgrammaticallyShowSlideOver,
      toggleProgrammaticallyShowSlideOver
    }
  }
})
</script>
