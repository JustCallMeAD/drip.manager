<template>
  <div
    id="static-backdrop-modal-buddy-input"
    class="modal"
    data-backdrop="static"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body px-5 py-10">
          <div class="intro-y box">
            <div
              class="
                flex flex-col
                sm:flex-row
                items-center
                p-5
                border-b border-gray-200
                dark:border-dark-5
              "
            >
              <div
                class="
                  alert alert-danger alert-dismissible
                  show
                  flex
                  items-center
                  mb-2
                "
                role="alert"
              >
                <AlertOctagonIcon class="w-6 h-6 mr-2" />
                A buddy address is required to continue to the faucet interface
              </div>
            </div>
            <div id="vertical-form" class="p-5">
              <div class="preview" style="display: block; opacity: 1">
                <div>
                  <label for="vertical-form-1" class="form-label">Spe</label
                  ><input
                    id="vertical-form-1"
                    type="text"
                    class="form-control"
                    placeholder="example@gmail.com"
                  />
                </div>

                <button class="btn btn-primary mt-5">
                  Approve buddy address
                </button>

                <router-link
                  data-dismiss="modal"
                  :to="{ name: 'top-menu-dashboard-overview-2' }"
                  >Go to Fountain</router-link
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
})
</script>
