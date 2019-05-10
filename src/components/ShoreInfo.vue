<template>
  <div>
    <div class="shore-info">
      <!--h2>{{ data.key }}</h2-->
      <slot name="header">
        <button
          v-if="seltype === 'free'"
          id="show-modal"
          @click="$emit('show-reservationform')"
        >
          {{ $t('message.reserve') }}
        </button>
        <button id="show-modal2" @click="$emit('show-cleanform')">
          {{ $t('message.claim_clean') }}
        </button>
      </slot>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'shore-info',

  props: ['data', 'seltype'],

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
  @media only screen and (max-width: 1366px) {
    button {
      background-color: #f0e41a;
      color: #000;
      padding: 0.5rem 0.5rem;
      font-size: 1rem;
      min-width: 4ex;
      font-weight: bold;
      font-family: inherit;
    }
  }
}
</style>
