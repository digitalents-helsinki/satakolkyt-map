<template>
  <div>
    <div class="footer">
      <shore-info
        @show-reservationform="this.showReservationForm"
        @show-cleanform="this.showCleanedForm"
        :data="this.$props.data"
      />
    </div>
    <div class="colors"></div>
  </div>
</template>

<script>
import ShoreInfo from './ShoreInfo'

export default {
  name: 'app-footer',
  props: ['data', 'showReservation', 'showCleaned', 'hideShore'],
  components: {
    ShoreInfo
  },
  mounted() {},
  methods: {
    showReservationForm(data) {
      this.$emit('show-reservationform', data)
    },
    showCleanedForm(data) {
      this.$emit('show-cleanform', data)
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 99;
  width: 100vw;
  height: 8vh;
  padding: 0%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: white;
}
.colors {
  position: fixed;
  right: 0;
  z-index: 999;
  bottom: 0;
  width: 15%;
  height: 20vh;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: #f0e41a;
}
</style>
