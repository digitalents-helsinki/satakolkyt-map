// Copyright (C) 2019 Digitalents Helsinki

<template>
  <div class="shore-info">
    <button
      v-if="seltype === 'free' || seltype === 'multifree'"
      @click="$emit('show-reservationform')"
    >
      {{ $t('message.reserve') }}
    </button>
    <button
      v-if="
        seltype === 'free' ||
          seltype === 'reserved' ||
          seltype === 'multifree' ||
          seltype === 'multireserved'
      "
      id="show-modal2"
      @click="$emit('show-cleanform')"
    >
      {{
        seltype === 'free' || seltype === 'reserved'
          ? $t('message.claim_clean')
          : $t('message.claim_clean_multi')
      }}
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
    background-color: #eee350;
    color: #000;
    font-size: 1rem;
    font-weight: bold;
    font-family: inherit;
  }

  h2 {
    font-weight: bold;
  }
}

@media only screen and (max-width: 1366px) {
  .shore-info {
    justify-content: center;
  }
}

@media only screen and (max-width: 768px) {
  .shore-info {
    button {
      min-width: 45vw;
      max-width: 45vw;
    }
  }
}
</style>
