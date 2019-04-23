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
  actions: {
    getfreelayer({ commit }) {
      fetch('http://' + location.hostname + ':8089/api/map/shores')
        .then(response => {
          return response.json()
        })
        .then(shores => {
          commit('storefreelayer', shores.data)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
})
