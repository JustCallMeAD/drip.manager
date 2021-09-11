<template>
  <div>
    <DarkModeSwitcher />
    <MobileMenu />
    <!-- BEGIN: Top Bar -->
    <div
      class="
        border-b border-theme-29
        -mt-10
        md:-mt-5
        -mx-3
        sm:-mx-8
        px-3
        sm:px-8
        pt-3
        md:pt-0
        mb-10
      "
    >
      <div class="top-bar-boxed flex items-center">
        <!-- BEGIN: Logo -->
        <router-link
          :to="{ name: 'top-menu-faucet' }"
          tag="a"
          class="-intro-x hidden md:flex"
        >
          <img alt="Drip Manager" class="w-6" src="@/assets/images/logo.svg" />
          <span class="text-white text-lg ml-3">
            Drip<span class="font-medium"> Manager</span>
          </span>
        </router-link>
        <!-- END: Logo -->
        <!-- BEGIN: Breadcrumb -->
        <div class="-intro-x breadcrumb breadcrumb--light mr-auto"></div>
        <!-- END: Breadcrumb -->
        <!-- BEGIN: Notifications -->

        <!-- END: Notifications -->
        <!-- BEGIN: Account Menu -->
        <div class="intro-x">
          <button
            :disabled="isConnected"
            @click="connect"
            class="btn btn-secondary"
          >
            {{ userAddress }}
          </button>
        </div>
        <!-- END: Account Menu -->
      </div>
    </div>
    <!-- END: Top Bar -->
    <!-- BEGIN: Top Menu -->
    <nav class="top-nav">
      <ul>
        <!-- BEGIN: First Child -->
        <li v-for="(menu, menuKey) in formattedMenu" :key="menuKey">
          <a
            :href="
              menu.subMenu
                ? 'javascript:;'
                : router.resolve({ name: menu.pageName }).path
            "
            class="top-menu"
            :class="{
              'top-menu--active': menu.active
            }"
            @click="linkTo(menu, router, $event)"
          >
            <div class="top-menu__icon">
              <component :is="menu.icon" />
            </div>
            <div class="top-menu__title">
              {{ menu.title }}
              <ChevronDownIcon v-if="menu.subMenu" class="top-menu__sub-icon" />
            </div>
          </a>
          <!-- BEGIN: Second Child -->
          <ul v-if="menu.subMenu">
            <li v-for="(subMenu, subMenuKey) in menu.subMenu" :key="subMenuKey">
              <a
                :href="
                  subMenu.subMenu
                    ? 'javascript:;'
                    : router.resolve({ name: subMenu.pageName }).path
                "
                class="top-menu"
                @click="linkTo(subMenu, router, $event)"
              >
                <div class="top-menu__icon">
                  <ActivityIcon />
                </div>
                <div class="top-menu__title">
                  {{ subMenu.title }}
                  <ChevronDownIcon
                    v-if="subMenu.subMenu"
                    class="top-menu__sub-icon"
                  />
                </div>
              </a>
              <!-- BEGIN: Third Child -->
              <ul v-if="subMenu.subMenu">
                <li
                  v-for="(lastSubMenu, lastSubMenuKey) in subMenu.subMenu"
                  :key="lastSubMenuKey"
                >
                  <a
                    :href="
                      lastSubMenu.subMenu
                        ? 'javascript:;'
                        : router.resolve({ name: lastSubMenu.pageName }).path
                    "
                    class="top-menu"
                    @click="linkTo(lastSubMenu, router, $event)"
                  >
                    <div class="top-menu__icon">
                      <component :is="'zap-icon'" />
                    </div>
                    <div class="top-menu__title">
                      {{ lastSubMenu.title }}
                    </div>
                  </a>
                </li>
              </ul>
              <!-- END: Third Child -->
            </li>
          </ul>
          <!-- END: Second Child -->
        </li>
        <!-- END: First Child -->
      </ul>
    </nav>
    <!-- END: Top Menu -->
    <!-- BEGIN: Content -->
    <div class="content">
      <router-view />
    </div>
    <!-- END: Content -->
  </div>
</template>

<script>
import { defineComponent, computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '@/store'
import { helper as $h } from '@/utils/helper'
import TopBar from '@/components/top-bar/Main.vue'
import MobileMenu from '@/components/mobile-menu/Main.vue'
import DarkModeSwitcher from '@/components/dark-mode-switcher/Main.vue'
import { nestedMenu, linkTo } from '@/layouts/side-menu'
import authManager from '@/auth/auth-manager'

const formatAddress = (address) => {
  if (address) {
    return (
      address.substring(0, 5) + '...' + address.substring(address.length - 6)
    )
  }
}

export default defineComponent({
  components: {
    TopBar,
    MobileMenu,
    DarkModeSwitcher
  },
  methods: {
    logout: function () {
      const self = this
      authManager
        .logout()
        .then(() => {
          self.router.push({ name: 'login' })
        })
        .catch((e) => {
          alert(e)
        })
    }
  },
  mounted() {},
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const formattedMenu = ref([])
    const userAddress = ref('')
    const topMenu = computed(() => {
      return nestedMenu(store.state.topMenu.menu, route)
    })
    const isConnected = ref(false)

    watch(
      computed(() => route.path),
      () => {
        formattedMenu.value = $h.toRaw(topMenu.value)
      }
    )

    const updateAddress = () => {
      if (store.state.main.userAddress) {
        userAddress.value = formatAddress(store.state.main.userAddress)
        isConnected.value = true
      } else {
        userAddress.value = 'Connect'
        isConnected.value = false
      }
    }

    watch(
      computed(() => store.state.main.userAddress),
      () => {
        updateAddress()
      }
    )

    onMounted(() => {
      cash('body')
        .removeClass('error-page')
        .removeClass('login')
        .addClass('main')
      const menu = $h.toRaw(topMenu.value)
      formattedMenu.value = menu

      updateAddress()
    })

    const connect = async function () {
      if (window.ethereum) {
        try {
          if (!store.state.main.userAddress) {
            const accounts = await window.ethereum.request({
              method: 'eth_requestAccounts'
            })
            if (accounts) {
              store.dispatch('main/setUserAddress', accounts[0])
            }
          }
        } catch (e) {
          console.log(e.message)
        }
      }
    }

    return {
      connect,
      isConnected,
      userAddress,
      formattedMenu,
      router,
      linkTo
    }
  }
})
</script>
