<template>
  <div>
    <div class="shore-info">
      <h2>{{ data['hel:id'] }}</h2>
      <button id="show-modal" @click="$emit('show-reservationform')">
        Show Modal
      </button>
      <button v-on:click="deleteHandler">Delete this beach</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'shore-info',

  props: ['data'],

  data() {
    return {
      showModal: false
    }
  },

  methods: {
    clickHandler() {
      axios({
        method: 'POST',
        url: 'http://localhost:8089/api/map/cleanbeach',

        data: { key: this.data.key }
      }).then(response => {
        this.$emit('reserve-intention', response.data.json)
      })
    },
    deleteHandler() {
      axios({
        method: 'POST',
        url: 'http://localhost:8089/api/map/delete/' + this.data.key,

        data: { key: this.data.key }
      }).then(response => {
        this.$emit('delete-shore', response.data.json)
      })
    }
  },
  mounted() {}
}
</script>

<style lang="scss" scoped>
.shore-info {
  h2 {
    font-weight: bold;
  }
}
</style>
