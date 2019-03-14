<template>
  <div class="shore-info">
    <h2>{{ data['hel:id'] }}</h2>
    <button @click="clickHandler">CLEAN THIS SHORE PLS!</button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'shore-info',

  props: ['data'],

  methods: {
    clickHandler() {
      axios({
        method: 'POST',
        url: 'http://localhost:8089/api/map/cleanbeach',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          key: this.data.key
        }
      })
    }
  },

  mounted() {
    console.log(this.data)
  }
}
</script>

<style lang="scss" scoped>
.shore-info {
  h2 {
    font-weight: bold;
  }
}
</style>
