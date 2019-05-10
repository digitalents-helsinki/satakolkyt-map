<template>
  <div>
    <div class="footer">
      <div class="buttons">
        <template v-if="!this.$props.adminmode">
          <shore-info
            v-show="this.$props.data"
            @show-reservationform="this.showReservationForm"
            @show-cleanform="this.showCleanedForm"
            :data="this.$props.data"
            :seltype="seltype"
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
      <div class="counter" :class="{ hide: this.$props.data }">
        <div class="stepcount green">
          620 597
        </div>
        <div class="stepinfo">
          {{ $t('message.steps_walked') }}
        </div>
        <div class="kilometercount red">
          89
        </div>
        <div class="kiloinfo">
          {{ $t('message.km_cleaned') }}
        </div>
      </div>
    </div>
    <div class="colors">
      <div class="container">
        <div class="title">{{ $t('message.shores') }}:</div>
        <div class="images">
          <div class="free">
            <img src="../Icons/blue.svg" alt="" />
            {{ $t('message.shoresfree') }}
          </div>
          <div class="selected">
            <img src="../Icons/lblue.svg" alt="" />
            {{ $t('message.shoresselected') }}
          </div>
          <div class="reserved">
            <img src="../Icons/red.svg" alt="" />
            {{ $t('message.shoresreserved') }}
          </div>
          <div class="cleaned">
            <img src="../Icons/green.svg" alt="" />
            {{ $t('message.shorescleaned') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ShoreInfo from './ShoreInfo'
import AdminShoreInfo from './AdminShoreInfo'

export default {
  name: 'app-footer',
  props: [
    'data',
    'seltype',
    'action',
    'showReservation',
    'showCleaned',
    'showShoreData',
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
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 99;
  width: 85vw;
  height: 8vh;
  padding: 0%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: white;

  .buttons {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 20px;
  }

  .counter {
    position: absolute;
    z-index: 9995;
    bottom: 5px;
    right: 20px;
    align-items: center;
    display: flex;
    font-size: 3em;
    font-weight: bold;

    .stepinfo,
    .kiloinfo {
      text-transform: uppercase;
      max-width: 150px;
      font-size: 32px;
      margin-left: 0.5em;
    }
  }
}
.colors {
  position: fixed;
  right: 0;
  z-index: 999;
  bottom: 0;
  width: 15vw;
  height: 20vh;
  display: flex;
  text-transform: uppercase;
  font-weight: 700;
  flex-direction: column;
  background-color: #f0e41a;
  .title {
    margin-bottom: 10px;
    margin-top: 20px;
  }
  .container {
    margin-left: 30px;
  }
  .images img {
    width: 50%;
  }
  .images div {
    margin-bottom: 20px;
  }
}

.green {
  color: green;
  margin-right: 5px;
}
.red {
  color: red;
  margin-left: 5px;
}
@media only screen and (max-width: 768px) {
  .footer {
    bottom: 30px;
    width: 100%;
    height: 20%;
    background-color: transparent;

    .buttons {
      width: 100%;
      margin: 0;
    }
  }
  .colors {
    display: none;
  }
  .counter {
    display: none;
  }
  .stepcount,
  .kilometercount {
    display: none;
  }
  .stepinfo,
  .kiloinfo {
    display: none;
  }
}
</style>
