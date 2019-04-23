import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    maplayers: {
      freelayer: {}
    }
  },
  mutations: {
    storefreelayer(state, n) {
      state.maplayers.freelayer = n
    }
  },
  actions: {}
})
