<template>
  <div>
    <DarkModeSwitcher />
    <div class="container sm:px-10">
      <div class="block xl:grid grid-cols-2 gap-4">
        <!-- BEGIN: Login Info -->
        <div class="hidden xl:flex flex-col min-h-screen">
          <a href="" class="-intro-x flex items-center pt-5">
            <img
              alt="Drip Manager"
              class="w-6"
              :src="require(`@/assets/images/logo.svg`)"
            />
            <span class="text-white text-lg ml-3">
              Drip <span class="font-medium">Manager</span>
            </span>
          </a>
          <div class="my-auto">
            <img
              alt="Drip Manager"
              class="-intro-x w-1/2 -mt-20"
              :src="require(`@/assets/images/large-drop.png`)"
            />
            <div class="-intro-x text-white font-medium text-4xl leading-tight">
              What is Drip Manager?
            </div>
            <div
              class="
                -intro-x
                mt-2
                text-lg text-white text-opacity-70
                dark:text-gray-500
              "
            >
              Drip Manager will help you manage your team. Most of the
              <br />legacy drip.community feature are also available <br />for
              the convenience of the user and more.
              <br />
              <br />Visit legacy Website:
              <a href="https://drip.community">drip.community</a>
            </div>
          </div>
        </div>
        <!-- END: Login Info -->
        <!-- BEGIN: Login Form -->
        <div class="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
          <div
            class="
              my-auto
              mx-auto
              xl:ml-20
              bg-white
              dark:bg-dark-1
              xl:bg-transparent
              px-5
              sm:px-8
              py-8
              xl:p-0
              rounded-md
              shadow-md
              xl:shadow-none
              w-full
              sm:w-3/4
              lg:w-2/4
              xl:w-auto
            "
          >
            <h2
              class="
                intro-x
                font-bold
                text-2xl
                xl:text-3xl
                text-center
                xl:text-left
              "
            >
              Sign In
            </h2>
            <div class="intro-x mt-8"></div>
            <div class="intro-x mt-5 xl:mt-8 text-center xl:text-left">
              <button
                @click="login"
                class="
                  btn btn-primary
                  py-3
                  px-4
                  w-full
                  xl:w-32 xl:mr-3
                  align-top
                "
              >
                Metamask
              </button>
              <router-link
                :to="{ path: '/calculator' }"
                class="
                  btn btn-primary
                  py-3
                  px-4
                  w-full
                  xl:w-32 xl:mr-3
                  align-top
                "
                >As guess</router-link
              >
            </div>
          </div>
        </div>
        <!-- END: Login Form -->
      </div>
    </div>
  </div>
</template>

<script>
import router from '@/router'
import { defineComponent, onMounted } from 'vue'
import DarkModeSwitcher from '@/components/dark-mode-switcher/Main.vue'
import authManager from '@/auth/auth-manager'

export default defineComponent({
  components: {
    DarkModeSwitcher
  },
  setup() {
    onMounted(() => {
      cash('body')
        .removeClass('main')
        .removeClass('error-page')
        .addClass('login')
    })
  },
  methods: {
    login: () => {
      authManager
        .authenticate(router)
        .then(() => router.push({ path: '/' }))
        .catch((e) => alert(JSON.stringify(e)))
    }
  }
})
</script>
