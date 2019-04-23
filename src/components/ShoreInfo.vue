<template>
  <div>
    <div class="shore-info">
      <h2>{{ data['hel:id'] }}</h2>
      <slot name="header">
        <button id="show-modal" @click="$emit('show-reservationform')">
          {{ $t('message.reserve') }}
        </button>
        <button id="show-modal2" @click="$emit('show-cleanform')">
          {{ $t('message.claim') }}
        </button>
      </slot>
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
  methods: {},
  mounted() {}
}
</script>

<style lang="scss" scoped>
.shore-info {
  h2 {
    font-weight: bold;
  }
  #show-modal {
    border-color: green;
  }
  #delete {
    border-color: red;
  }
}
</style>
