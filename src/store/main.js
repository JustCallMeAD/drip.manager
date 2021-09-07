import * as types from './mutation-types'

const state = () => {
  return {
    darkMode: false,
    isAuthenticated: false,
    userAddress: undefined
  }
}

// getters
const getters = {
  darkMode: (state) => state.darkMode,
  isAuthenticated: (state) => state.isAuthenticated,
  userAddress: (state) => state.userAddress
}

// actions
const actions = {
  setDarkMode({ commit }, darkMode) {
    commit(types.SET_DARK_MODE, { darkMode })
  },
  setAuthenticated({ commit }, authState) {
    commit(types.SET_AUTHENTICATED, { authState })
  },
  setUserAddress({ commit }, userAddress) {
    commit(types.SET_USER_ADDRESS, { userAddress })
  }
}

// mutations
const mutations = {
  [types.INIT](state) {
    const userAddress = localStorage.getItem('userAddress')
    if (userAddress) {
      state.userAddress = userAddress
    }

    const darkMode = localStorage.getItem('darkMode')
    if (darkMode) {
      state.darkMode = darkMode === 'true'
    }
  },
  [types.SET_DARK_MODE](state, { darkMode }) {
    state.darkMode = darkMode
    localStorage.setItem('darkMode', darkMode)
  },
  [types.SET_AUTHENTICATED](state, { authState }) {
    state.isAuthenticated = authState
  },
  [types.SET_USER_ADDRESS](state, { userAddress }) {
    state.userAddress = userAddress
    localStorage.setItem('userAddress', userAddress)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
