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
@import url('https://fonts.googleapis.com/css?family=Noto+Sans|Ubuntu');
html {
  overflow-y: auto;
  font-family: 'Noto Sans', 'Ubuntu' 'Inter UI', -apple-system,
    BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
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
  background-color: transparent;
  color: #000;
  padding: 0.8rem 1rem;
  border-radius: 40px;
  font-size: 1rem;
  min-width: 20ex;
  font-weight: bold;
  font-family: inherit;
  border: 3px solid #475dcc;
  margin-right: 5px;
}
button:hover {
  box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.24),
    0 17px 50px 0 rgba(0, 0, 0, 0.19);
}
</style>
