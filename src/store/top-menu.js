const state = () => {
  return {
    menu: [
      {
        icon: 'DownloadIcon',
        pageName: 'top-menu-faucet',
        title: 'Faucet'
      },
      {
        icon: 'ShoppingCartIcon',
        pageName: 'top-menu-fountain',
        title: 'Fountain'
      },
      {
        icon: 'DropletIcon',
        pageName: 'top-menu-reservoir',
        title: 'Reservoir'
      },
      {
        icon: 'UsersIcon',
        pageName: 'top-menu-team',
        title: 'Team'
      },
      {
        icon: 'DollarSignIcon',
        pageName: 'top-menu-calculator',
        title: 'Calculator',
        access: 'guest'
      },
      {
        icon: 'PieChartIcon',
        pageName: 'top-menu-chart',
        title: 'Chart',
        access: 'guest'
      }
    ]
  }
}

// getters
const getters = {
  menu: state => state.menu
}

// actions
const actions = {}

// mutations
const mutations = {}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
