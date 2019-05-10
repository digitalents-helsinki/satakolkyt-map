<template>
  <div>
    <div class="shore-info">
      <h2>{{ data['hel:id'] }}</h2>
      <slot name="header">
        <button
          v-if="action === 'hide'"
          class="hideShoreButton"
          v-on:click="hideShore"
        >
          {{ $t('message.hideshore') }}
        </button>
        <button
          v-if="action === 'unhide'"
          class="unHideShoreButton"
          v-on:click="unHideShore"
        >
          {{ $t('message.unhideshore') }}
        </button>
      </slot>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'admin-shore-info',

  props: ['data', 'action'],

  data() {
    return {
      showModal: false
    }
  },

  methods: {
    hideShore() {
      axios({
        method: 'POST',
        url:
          'http://' +
          location.hostname +
          ':8089/api/map/delete/' +
          this.data.key,

        data: { key: this.data.key }
      }).then(response => {
        this.$emit('hide-shore', response.data.json)
      })
    },
    unHideShore() {
      axios({
        method: 'POST',
        url: process.env.VUE_APP_URL + '/api/map/unhidebeach',
        data: { key: this.data.key }
      }).then(response => {
        this.$emit('unhide-shore', response.data.json)
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
  .unHideShoreButton {
    border-color: green;
  }
  .hideShoreButton {
    border-color: red;
  }
}
</style>
