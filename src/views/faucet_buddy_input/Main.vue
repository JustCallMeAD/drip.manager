<template>
  <!-- BEGIN: BUDDY INPUT -->

  <div class="grid grid-cols-2 gap-6">
    <div class="col-span-2 mt-2 intro-y">
      <h2 class="text-lg font-medium truncate mr-5">Buddy</h2>
    </div>
    <div class="col-span-2 xl:col-span-2">
      <div class="intro-y box" v-bind:class="{ required: isBuddyRequired }">
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
              <div class="form-help">Enter your buddy address here.</div>
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
                <div id="input-group-price" class="input-group-text">Drips</div>
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
                <div id="input-group-price" class="input-group-text">Drips</div>
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
                <div id="input-group-price" class="input-group-text">Drips</div>
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

  <!-- END: BUDDY INPUT -->
</template>

<script>
import { defineComponent } from 'vue'
import smManager from '@/smartcontracts/smartcontracts-manager'
import authManager from '@/auth/auth-manager'


export default defineComponent({
  components: {},
  async mounted() {
    const self = this

  const buddyAddress = await faucet.getBuddyAddress()
    if (
      !buddyAddress ||
      buddyAddress === '0x0000000000000000000000000000000000000000'
    ) {
      this.isBuddyRequired = true
    } else {
      this.isBuddyRequired = false

      const userInfoTotals = await faucet.getUserInfoTotals(buddyAddress)
      self.isBuddySpecified = true
      self.inputBuddyAddress = buddyAddress
      self.buddyAirdropSent = userInfoTotals.airdrops_total.toFixed(3)
      self.buddyAirdropReceived = userInfoTotals.airdrops_received.toFixed(3)
      self.buddyTotalDeposits = userInfoTotals.total_deposits.toFixed(3)
    }


  }
})
</script>
