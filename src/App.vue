<template>
  <router-view />
</template>
<script>
import { defineComponent } from 'vue'
import * as types from './store/mutation-types'
import store from './store'

export default defineComponent({
  beforeCreate() {
    store.commit('main/' + types.INIT)
  }
})
</script>
