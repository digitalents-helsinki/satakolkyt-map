import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    maplayers: {
      freelayer: {},
      reservedlayer: {},
      cleanlayer: {}
    }
  },
  mutations: {
    storefreelayer(state, n) {
      state.maplayers.freelayer = n
    },
    storereservedlayer(state, n) {
      state.maplayers.reservedlayer = n
    },
    storecleanlayer(state, n) {
      state.maplayers.cleanlayer = n
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
    },
    getreservedlayer({ commit }) {
      fetch('http://' + location.hostname + ':8089/api/map/shores/reserved')
        .then(response => {
          return response.json()
        })
        .then(shores => {
          commit('storereservedlayer', shores.data)
        })
        .catch(error => {
          console.log(error)
        })
    },
    getcleanlayer({ commit }) {
      fetch('http://' + location.hostname + ':8089/api/map/shores/cleaned')
        .then(response => {
          return response.json()
        })
        .then(shores => {
          commit('storecleanlayer', shores.data)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
})
