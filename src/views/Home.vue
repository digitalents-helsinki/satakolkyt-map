// Copyright (C) 2019 Digitalents Helsinki

<template>
  <div class="home">
    <vue-headful :title="$t('message.app')" />
    <div class="map-container">
      <div class="dimmer" v-if="showReservationForm" @click="toggleModal" />
      <shore-map
        ref="usermap"
        :freeshores="this.$store.state.maplayers.freelayer"
        :reservedshores="this.$store.state.maplayers.reservedlayer"
        :cleanedshores="this.$store.state.maplayers.cleanlayer"
        :hiddenshores="this.$store.state.maplayers.hiddenlayer"
        @map-loaded="mapLoaded"
        @free-click="selectFree"
        @reserved-click="selectReserved"
        @cleaned-click="selectCleaned"
      />
      <app-footer
        @show-reservationform="showReservationForm = true"
        @show-cleanform="showCleaned = true"
        :data="selectedShoreData"
        :seltype="selectedShoreType"
        :showReservation="showReservationForm"
        :counterSteps="counterSteps"
        :counterKm="counterKm"
      />
      <div v-if="showReservationForm">
        <transition name="modal">
          <ReserveModal
            v-bind:selected="selectedShoreData"
            @reservation-action="saveReservation"
            @close="showReservationForm = false"
            @show-privacy-info="showPrivacyInfo = true"
          >
          </ReserveModal>
        </transition>
      </div>
      <div v-if="showCleaned">
        <transition name="modal">
          <CleanModal
            v-bind:selected="selectedShoreData"
            @close="showCleaned = false"
            @show-privacy-info="showPrivacyInfo = true"
            @cleaned-ok="shoreCleaned"
            @error-msg="setError"
          >
          </CleanModal>
        </transition>
      </div>
      <div v-if="showInfoBox" class="infoBoxWrapper">
        <InfoBox
          :data="infoBoxData"
          :type="selectedShoreType"
          @infobox-close="unSelect"
        />
      </div>
    </div>
    <div
      v-show="showPrivacyInfo"
      class="privacy-info-wrapper"
      @click="showPrivacyInfo = false"
    >
      <div class="privacy-info">
        <h1>{{ $t('message.privacy_policy') }}</h1>
        <p v-for="n in 20" :key="n">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, et!
          Alias impedit exercitationem a minus commodi quos eum illum? Fugiat
          sit cumque amet unde natus dolorum tempore sint dolore beatae!
        </p>
      </div>
    </div>
    <div
      class="error-info-wrapper"
      v-if="showErrorInfo"
      @click="showErrorInfo = false"
    >
      <div class="error-info">
        <p>{{ errMsg }}</p>
        <button @click="showErrorInfo = false">OK</button>
      </div>
    </div>
  </div>
</template>

<script>
import ShoreMap from '@/components/ShoreMap'
import ReserveModal from '@/components/ReserveModal'
import CleanModal from '@/components/CleanModal'
import AppFooter from '@/components/AppFooter'
import InfoBox from '@/components/InfoBox'
import axios from 'axios'
export default {
  name: 'home',

  data() {
    return {
      showCleaned: false,
      showReservationForm: false,

      reservedInfo: null,
      cleanedInfo: null,

      // Selected Shore
      selectedShoreData: null,
      selectedShoreType: '',

      //Infobox
      showInfoBox: false,
      infoBoxData: null,

      showPrivacyInfo: false,

      //Footer counter stuff
      counterSteps: null,
      counterKm: null,

      //Error stuff
      errMsg: '',
      showErrorInfo: false
    }
  },

  components: {
    //MapView,
    ShoreMap,
    ReserveModal,
    CleanModal,
    AppFooter,
    InfoBox
  },

  methods: {
    generateLineStringStyle(color) {
      return {
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': color,
          'line-width': 5
        }
      }
    },
    mapLoaded(map) {
      this.map = map
    },
    saveReservation(args) {
      axios({
        method: 'POST',
        url: process.env.VUE_APP_URL + '/api/map/reserve',

        data: args.data
      })
        .then(response => {
          if (response.data.status === 'ok') {
            args.okCB()
            this.shoreReserved(response.data.json)
          }
        })
        .catch(err => {
          this.setError(err.response.data.error)
        })
    },
    setError(msg) {
      this.errMsg = this.$t('message.' + msg)
      this.showErrorInfo = true
    },
    shoreReserved(data) {
      this.unSelect()
      this.$refs.usermap.removeSegmentFromLayer(
        'freeShore',
        'freelayer',
        data._key
      )
      this.$refs.usermap.addSegmentToLayer(
        'reservedShore',
        'reservedlayer',
        data
      )
    },
    shoreCleaned(data) {
      this.unSelect()
      if (data.status === 'reserved') {
        this.$refs.usermap.removeSegmentFromLayer(
          'reservedShore',
          'reservedlayer',
          data._key
        )
      } else if (data.status === 'free') {
        this.$refs.usermap.removeSegmentFromLayer(
          'freeShore',
          'freelayer',
          data._key
        )
      }
      this.$refs.usermap.addSegmentToLayer('cleanedShore', 'cleanlayer', data)
    },
    initMap() {
      this.$store.dispatch('getfreelayer')
      this.$store.dispatch('getreservedlayer')
      this.$store.dispatch('getcleanlayer')
      this.$store.dispatch('gethiddenlayer')
    },
    toggleModal() {
      this.showModal = !this.showModal
    },
    selectReserved(data) {
      this.infoBoxData = null
      this.selectedShoreData = data
      this.selectedShoreType = 'reserved'
      this.showInfoBox = true
      axios
        .get(process.env.VUE_APP_URL + '/api/map/reservedinfo/' + data.key)
        .then(
          res => {
            this.infoBoxData = res.data.data
          },
          err => {
            console.log(err)
          }
        )
    },
    selectCleaned(data) {
      this.infoBoxData = null
      this.selectedShoreData = data
      this.selectedShoreType = 'cleaned'
      this.showInfoBox = true
      axios
        .get(process.env.VUE_APP_URL + '/api/map/cleanedinfo/' + data.key)
        .then(
          res => {
            this.infoBoxData = res.data.data
          },
          err => {
            console.log(err)
          }
        )
    },
    selectFree(data) {
      this.infoBoxData = null
      this.selectedShoreData = data
      this.selectedShoreType = 'free'
      this.infoBoxData = data
      this.showInfoBox = true
    },
    unSelect() {
      this.showInfoBox = false
      this.infoBoxData = null
      this.selectedShoreData = null
      this.selectedShoreType = null
      this.$refs.usermap.unRenderSelected()
    },
    getStepsKm() {
      axios.get(process.env.VUE_APP_URL + '/api/map/stepskm/').then(
        res => {
          this.counterKm = res.data.km
          this.counterSteps = res.data.steps
        },
        err => {
          console.log(err)
        }
      )
    }
  },

  mounted() {
    this.initMap()
    this.getStepsKm()
  }
}
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
  position: relative;

  .privacy-info-wrapper {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 9999;

    .privacy-info {
      max-width: 600px;
      width: 90vw;
      max-height: 800px;
      height: 90vh;
      background-color: white;
      margin: 5vh auto;
      overflow-y: auto;
      padding: 10px 30px;

      h1 {
        font-size: 24px;
        font-weight: bold;
        text-align: center;
        margin: 20px 0 40px 0;
      }

      p {
        margin: 20px 0;
      }
    }
  }

  .error-info-wrapper {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 9999;

    .error-info {
      position: relative;
      width: 300px;
      height: 200px;
      background-color: #881111;
      margin: 40vh auto;

      p {
        font-size: 18px;
        font-weight: bold;
        color: white;
        text-align: center;
        padding-top: 50px;
      }

      button {
        position: absolute;
        bottom: 30px;
        left: 50px;
        background-color: grey;
        color: black;
        width: 100px;
        height: 50px;
        display: block;
      }
    }
  }
}

.dimmer {
  position: fixed;
  z-index: 50;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
}

.map-container {
  position: relative;
  height: 100%;

  .infoBoxWrapper {
    position: absolute;
    left: 50px;
    bottom: 120px;
  }
}

.initial-background {
  position: relative;
  background-image: url('/bg.jpg');
  filter: blur(4px) opacity(0.6);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100vh;
}
.initial {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  color: #4e4a45;

  h1 {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 2rem;
  }

  button {
    width: 20ex;
  }
  .no-blur {
    filter: blur(0px);
  }
}

.overlay-box-wrapper {
  position: fixed;
  bottom: 0;
  z-index: 100;
  width: 100vw;
}

.overlayPop-enter-active {
  transition: transform 0.3s;
}

.overlayPop-leave-active {
  transition: all 0.5s;
}
.overlayPop-enter /* .fade-leave-active below version 2.1.8 */ {
  transform: translateY(-1em);
  opacity: 0;
}

.overlayPop-leave-to {
  transform: translateY(1em);
  opacity: 0;
}
</style>
