<template>
  <div>
    <div class="footer">
      <template v-if="!this.$props.adminmode">
        <shore-info
          @show-reservationform="this.showReservationForm"
          @show-cleanform="this.showCleanedForm"
          :data="this.$props.data"
        />
      </template>
      <template v-else>
        <admin-shore-info
          :data="this.$props.data"
          :action="this.$props.action"
          @hide-shore="this.hideShoreMap"
          @unhide-shore="this.unHideShoreMap"
        >
        </admin-shore-info>
      </template>
    </div>
    <div class="counter">
      <div class="stepcount green">
        620 597
      </div>
      <div class="stepinfo">
        askelta kävelty
      </div>
      <div class="kilometercount red">
        89
      </div>
      <div class="kiloinfo">
        km siivottu
      </div>
    </div>
    <div class="colors"></div>
  </div>
</template>

<script>
import ShoreInfo from './ShoreInfo'
import AdminShoreInfo from './AdminShoreInfo'

export default {
  name: 'app-footer',
  props: [
    'data',
    'action',
    'showReservation',
    'showCleaned',
    'unHideShore',
    'hideShore',
    'adminmode'
  ],
  components: {
    ShoreInfo,
    AdminShoreInfo
  },
  mounted() {},
  methods: {
    showReservationForm(data) {
      this.$emit('show-reservationform', data)
    },
    showCleanedForm(data) {
      this.$emit('show-cleanform', data)
    },
    hideShoreMap(data) {
      this.$emit('hide-shore', data)
    },
    unHideShoreMap(data) {
      this.$emit('unhide-shore', data)
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
  background-image: url('/info.png');
}
.counter {
  z-index: 999;
  text-align: center;
  position: fixed;
  bottom: 0;
  right: 30%;
  align-items: center;
  display: flex;
  font-size: 3em;
}
.green {
  color: green;
  margin-right: 5px;
}
.red {
  color: red;
  margin-left: 5px;
}
@media only screen and (max-width: 1366px) {
  .counter {
    font-size: 2em;

    right: 20%;
  }
}
</style>
