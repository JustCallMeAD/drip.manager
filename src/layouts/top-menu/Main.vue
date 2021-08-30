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
        <div class="intro-x dropdown mr-4 sm:mr-6">
          <!-- <div
            class="
              dropdown-toggle
              notification notification--light notification--bullet
              cursor-pointer
            "
            role="button"
            aria-expanded="false"
          >
            <BellIcon class="notification__icon dark:text-gray-300" />
          </div> -->
          <!-- <div class="notification-content pt-2 dropdown-menu">
            <div
              class="
                notification-content__box
                dropdown-menu__content
                box
                dark:bg-dark-6
              "
            >
              <div class="notification-content__title">Notifications</div>
              <div
                v-for="(faker, fakerKey) in $_.take($f(), 5)"
                :key="fakerKey"
                class="cursor-pointer relative flex items-center"
                :class="{ 'mt-5': fakerKey }"
              >
                <div class="w-12 h-12 flex-none image-fit mr-1">
                  <img
                    alt="Drip Manager"
                    class="rounded-full"
                    :src="require(`@/assets/images/${faker.photos[0]}`)"
                  />
                  <div
                    class="
                      w-3
                      h-3
                      bg-theme-9
                      absolute
                      right-0
                      bottom-0
                      rounded-full
                      border-2 border-white
                    "
                  ></div>
                </div>
                <div class="ml-2 overflow-hidden">
                  <div class="flex items-center">
                    <a href="javascript:;" class="font-medium truncate mr-5">
                      {{ faker.users[0].name }}
                    </a>
                    <div
                      class="text-xs text-gray-500 ml-auto whitespace-nowrap"
                    >
                      {{ faker.times[0] }}
                    </div>
                  </div>
                  <div class="w-full truncate text-gray-600 mt-0.5">
                    {{ faker.news[0].shortContent }}
                  </div>
                </div>
              </div>
            </div>
          </div> -->
        </div>
        <!-- END: Notifications -->
        <!-- BEGIN: Account Menu -->
        <div class="intro-x dropdown w-8 h-8">
          <div
            class="
              dropdown-toggle
              w-8
              h-8
              rounded-full
              overflow-hidden
              shadow-lg
              image-fit
              zoom-in
              scale-110
            "
            role="button"
            aria-expanded="false"
          >
            <img
              alt="Drip Manager"
              :src="require(`@/assets/images/${$f()[9].photos[0]}`)"
            />
          </div>
          <div class="dropdown-menu w-56">
            <div
              class="
                dropdown-menu__content
                box
                bg-theme-26
                dark:bg-dark-6
                text-white
              "
            >
              <div class="p-4 border-b border-theme-27 dark:border-dark-3">
                <div class="font-medium">
                  {{
                    userAddress.substring(0, 5) +
                    '...' +
                    userAddress.substring(userAddress.length - 6)
                  }}
                </div>
              </div>
              <!-- <div class="p-2">
                <a
                  href=""
                  class="
                    flex
                    items-center
                    block
                    p-2
                    transition
                    duration-300
                    ease-in-out
                    hover:bg-theme-1
                    dark:hover:bg-dark-3
                    rounded-md
                  "
                >
                  <UserIcon class="w-4 h-4 mr-2" /> Profile
                </a>
              </div> -->
              <div class="p-2 border-t border-theme-27 dark:border-dark-3">
                <a
                  href=""
                  @click="logout"
                  class="
                    flex
                    items-center
                    block
                    p-2
                    transition
                    duration-300
                    ease-in-out
                    hover:bg-theme-1
                    dark:hover:bg-dark-3
                    rounded-md
                  "
                >
                  <ToggleRightIcon class="w-4 h-4 mr-2" />
                  Logout
                </a>
              </div>
            </div>
          </div>
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
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const formattedMenu = ref([])
    const topMenu = computed(() => {
      return nestedMenu(store.state.topMenu.menu, route)
    })

    watch(
      computed(() => route.path),
      () => {
        formattedMenu.value = $h.toRaw(topMenu.value)
      }
    )

    onMounted(() => {
      cash('body')
        .removeClass('error-page')
        .removeClass('login')
        .addClass('main')
      formattedMenu.value = $h.toRaw(topMenu.value)
    })

    return {
      formattedMenu,
      router,
      linkTo,
      userAddress: authManager.getCurrentUserAddress()
    }
  }
})
</script>
