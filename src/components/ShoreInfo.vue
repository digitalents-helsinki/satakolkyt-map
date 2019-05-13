<template>
  <div class="shore-info">
    <!--h2>{{ data.key }}</h2-->
    <button v-if="seltype === 'free'" @click="$emit('show-reservationform')">
      {{ $t('message.reserve') }}
    </button>
    <button
      v-if="seltype === 'free' || seltype === 'reserved'"
      id="show-modal2"
      @click="$emit('show-cleanform')"
    >
      {{ $t('message.claim_clean') }}
    </button>
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
  display: flex;
  height: 80%;
  background-color: white;

  button {
    background-color: #f0e41a;
    color: #000;
    font-size: 1rem;
    font-weight: bold;
    font-family: inherit;
  }

  h2 {
    font-weight: bold;
  }
  @media only screen and (max-width: 1366px) {
    & {
      justify-content: center;
    }
  }
  @media only screen and (max-width: 768px) {
  }
}
</style>
