// Copyright (C) 2019 Digitalents Helsinki

<template>
  <div id="app">
    <header ref="nav">
      <app-header />
    </header>

    <main :style="AppStyle">
      <router-view />
    </main>
  </div>
</template>

<script>
import AppHeader from './components/AppHeader'
import axios from 'axios'

export default {
  components: {
    AppHeader
  },

  data() {
    return {
      mainOffset: 0
    }
  },

  computed: {
    AppStyle() {
      let vh = window.innerHeight * 0.01
      return {
        height: `calc(${vh} * 100px)`
      }
    }
  },

  methods: {},

  mounted() {
    axios.defaults.withCredentials = true
    axios.get(process.env.VUE_APP_URL + '/api/map/token').then(
      response => {
        axios.defaults.headers.common['X-CSRF-TOKEN'] = response.data.token
      },
      err => {
        console.log(err)
      }
    )
    // Calculate the header's height and size the <main/> element to fit the screen.
  }
}
</script>

<style src="nanoreset"></style>
<style src="mapbox-gl/dist/mapbox-gl.css"></style>
<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Noto+Sans|Ubuntu');
html {
  overflow-y: auto;
  font-family: 'Noto Sans', 'Ubuntu' 'Inter UI', -apple-system,
    BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
}

body {
  color: hsl(33, 6%, 22%);
}

main {
  overflow: hidden;
}

header {
  position: fixed;
  width: 100vw;
  z-index: 100;
}
.time-picker > input.display-time {
  width: 4em !important;
  background: transparent;
  padding: 0px !important;
  display: inline-flex;
}
.time-picker {
  width: 5em !important;
}
button {
  background-color: #f0e41a;
  color: #000;
  padding: 0.8rem 1rem;
  font-size: 1rem;
  min-width: 20ex;
  font-weight: bold;
  font-family: inherit;
  margin-right: 5px;
}
button:hover {
  box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.24),
    0 17px 50px 0 rgba(0, 0, 0, 0.19);
}
</style>
