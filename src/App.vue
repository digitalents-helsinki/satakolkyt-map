<template>
  <div id="app">
    <header ref="nav" v-if="this.$route.name === 'home'">
      <app-header />
    </header>
    <main :style="mainStyle">
      <router-view />
    </main>
  </div>
</template>

<script>
import AppHeader from './components/AppHeader'

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
    mainStyle() {
      return {
        height: `calc(100vh - 0px)`
      }
    }
  },

  methods: {
    getNavHeight() {
      const { height } = this.$refs.nav.getBoundingClientRect()

      return height
    }
  },

  mounted() {
    // Calculate the header's height and size the <main/> element to fit the screen.
    this.mainOffset = `${this.getNavHeight()}px`
  }
}
</script>

<style src="nanoreset"></style>
<style src="mapbox-gl/dist/mapbox-gl.css"></style>
<style lang="scss">
html {
  overflow-y: auto;
  font-family: 'Inter UI', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

body {
  color: #4e4a45;
}

header {
  position: fixed;
  width: 100vw;
  z-index: 100;
}

button {
  background-color: #475dcc;
  color: white;
  padding: 0.8rem 1rem;
  border-radius: 3px;
  font-size: 1rem;
  min-width: 20ex;
  font-weight: bold;
  font-family: inherit;
}
</style>
