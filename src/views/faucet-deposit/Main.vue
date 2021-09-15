<template>
  <div
    class="dropdown inline-block"
    id="dropdownButton"
    data-placement="bottom"
  >
    <button class="dropdown-toggle invisible" aria-expanded="false"></button>
    <div class="dropdown-menu">
      <div class="dropdown-menu__content box p-5">
        <div>
          <div class="text-xs">Amount to deposit</div>
          <input
            ref="input"
            type="number"
            min="0"
            class="form-control mt-2 flex-1"
            placeholder="0.00000"
            v-model="inputValue"
            v-on:keyup.enter="deposit"
          />
        </div>
        <div class="flex items-center mt-3">
          <button
            data-dismiss="dropdown"
            class="btn btn-secondary w-32 ml-auto"
          >
            Close
          </button>
          <button @click="deposit" class="btn btn-primary w-32 ml-2">
            Deposit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import scManager from '@/smartcontracts/smartcontracts-manager'
import store from '@/store'
const decimals = 10 ** 18

export default defineComponent({
  methods: {
    show2: function () {
      this.show()
      this.$refs.input.focus()
    },
    deposit: async function () {
      const address = store.state.main.userAddress
      if (!address) {
        alert('A wallet must be connected')
      }
      if (!this.inputValue) {
        alert('Specify a deposit amount')
        return
      }
      if (this.inputValue <= 0) {
        alert('A positive amount must be specified')
        return
      }

      try {
        this.contractCall = true
        const drip = await scManager.getDripContract()
        const dripBalance = (await drip.getDripBalanceOf(address)) / 10 ** 18
        if (dripBalance < this.inputValue) {
          alert('The amount cannot be greater than your wallet balance')
          return
        }

        const faucet = await scManager.getFaucetContract()
        await faucet.deposit(address, (this.inputValue * decimals).toString())
        alert('Deposit successful')
      } catch (e) {
        alert(JSON.stringify(e))
        console.error(JSON.stringify(e))
      } finally {
        this.contractCall = false
      }
      this.inputValue = null
      this.hide()
    }
  },
  mounted() {},
  setup() {
    const show = () => {
      cash('#dropdownButton').dropdown('toggle')
    }
    const hide = () => {
      cash('#dropdownButton').dropdown('hide')
    }
    const inputValue = ref(null)
    const contractCall = ref(false)
    return {
      inputValue,
      contractCall,
      show,
      hide
    }
  }
})
</script>
