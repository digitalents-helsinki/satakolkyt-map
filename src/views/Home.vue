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
        v-if="showMap"
        @map-loaded="mapLoaded"
        @free-click="selectFree"
        @reserved-click="selectReserved"
        @cleaned-click="selectCleaned"
        @unselect="unselectShore"
      />
      <section v-else>
        <div class="initial-background"></div>
        <div class="initial">
          <template v-if="isOnline" class="no-blur"
            ><h1>{{ $t('message.open_map') }}</h1>
            <button @click="() => (showMap = true)">
              {{ $t('message.open') }}
            </button>
          </template>
          <template class="no-blur" v-if="isOffline">
            <h1>{{ $t('message.offline') }}</h1>
          </template>
        </div>
      </section>
      <app-footer
        @show-reservationform="showReservationForm = true"
        @show-cleanform="showCleaned = true"
        :data="selectedShoreData"
        :seltype="selectedShoreType"
        :showReservation="showReservationForm"
      />
      <div v-if="showReservedInfo">
        <InfoBox type="reservation" v-bind:data="reservedInfo" />
      </div>
      <div v-if="showCleanedInfo">
        <InfoBox type="clean" v-bind:data="cleanedInfo" />
      </div>
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
//import MapView from '@/components/MapView'
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
      showMap: false,
      startMapOnMounted: false,
      showCleaned: false,
      showReservationForm: false,
      reservedInfo: null,
      showReservedInfo: false,
      cleanedInfo: null,
      showCleanedInfo: false,
      // Overlay box
      dimBackground: true,
      // Selected Shore
      selectedShoreData: null,
      selectedShoreType: '',
      showPrivacyInfo: false,
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
      this.$refs.usermap.unSelect()
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
      this.$refs.usermap.unSelect()
      this.$refs.usermap.removeSegmentFromLayer(
        'freeShore',
        'freelayer',
        data._key
      )
      this.$refs.usermap.addSegmentToLayer('cleanedShore', 'cleanlayer', data)
    },
    initMap() {
      this.$store.dispatch('getfreelayer')
      this.$store.dispatch('getreservedlayer')
      this.$store.dispatch('getcleanlayer')
      this.$store.dispatch('gethiddenlayer')

      this.$nextTick(() => {
        this.showMap = this.startMapOnMounted
      })
    },
    toggleModal() {
      this.showModal = !this.showModal
    },
    selectReserved(data) {
      this.selectedShoreData = data
      this.selectedShoreType = 'reserved'
      axios
        .get(
          'http://' +
            location.hostname +
            ':8089/api/map/reservedinfo/' +
            data.key
        )
        .then(
          res => {
            this.reservedInfo = res.data.data
            this.showReservedInfo = true
          },
          err => {
            console.log(err)
          }
        )
    },
    selectCleaned(data) {
      this.selectedShoreData = data
      this.selectedShoreType = 'cleaned'
      axios
        .get(
          'http://' +
            location.hostname +
            ':8089/api/map/cleanedinfo/' +
            data.key
        )
        .then(
          res => {
            this.cleanedInfo = res.data.data
            this.showCleanedInfo = true
          },
          err => {
            console.log(err)
          }
        )
    },
    selectFree(data) {
      this.selectedShoreData = data
      this.selectedShoreType = 'free'
    },
    unselectShore() {
      this.selectedShoreData = null
      this.showReservedInfo = false
      this.showCleanedInfo = false
    }
  },

  mounted() {
    this.initMap()
  },

  beforeDestroy() {
    this.showMap = this.startMapOnMounted
  }
}
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
  position: relative;
  overflow: hidden;

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
