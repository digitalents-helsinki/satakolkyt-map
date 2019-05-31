// Copyright (C) 2019 Digitalents Helsinki

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    maplayers: {
      freelayer: {},
      reservedlayer: {},
      cleanlayer: {},
      hiddenlayer: {}
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
    },
    storehiddenlayer(state, n) {
      state.maplayers.hiddenlayer = n
    }
  },
  actions: {
    getfreelayer({ commit }) {
      fetch(process.env.VUE_APP_URL + '/api/map/shores')
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
      fetch(process.env.VUE_APP_URL + '/api/map/shores/reserved')
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
      fetch(process.env.VUE_APP_URL + '/api/map/shores/cleaned')
        .then(response => {
          return response.json()
        })
        .then(shores => {
          commit('storecleanlayer', shores.data)
        })
        .catch(error => {
          console.log(error)
        })
    },
    gethiddenlayer({ commit }) {
      fetch(process.env.VUE_APP_URL + '/api/map/shores/hidden')
        .then(response => {
          return response.json()
        })
        .then(shores => {
          commit('storehiddenlayer', shores.data)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
})
