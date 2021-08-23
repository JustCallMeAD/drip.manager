import * as types from './mutation-types'

const state = () => {
  return {
    darkMode: false,
    isAuthenticated: false
  }
}

// getters
const getters = {
  darkMode: state => state.darkMode,
  isAuthenticated: state => state.isAuthenticated
}

// actions
const actions = {
  setDarkMode({ commit }, darkMode) {
    commit(types.SET_DARK_MODE, { darkMode })
  },
  setAuthenticated({ commit }, authState) {
    commit(types.SET_AUTHENTICATED, { authState })
  }
}

// mutations
const mutations = {
  [types.SET_DARK_MODE](state, { darkMode }) {
    state.darkMode = darkMode
  },
  [types.SET_AUTHENTICATED](state, { authState }) {
    state.isAuthenticated = authState
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
