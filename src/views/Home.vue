<template>
  <div class="home">
    <div class="map-container">
      <div class="dimmer" v-if="showOverlay" @click="toggleOverlay" />
      <div class="dimmer" v-if="showReservationForm" @click="toggleModal" />

      <map-view
        v-bind:data="this.$store.state.maplayers.freelayer"
        v-bind:data2="this.$store.state.maplayers.reservedlayer"
        v-bind:data3="this.$store.state.maplayers.cleanlayer"
        v-if="showMap"
        @map-loaded="mapLoaded"
        @shore-click="populateSelectedShoreData"
      />
      <section v-else class="initial">
        <h1>{{ $t('message.open_map') }}</h1>
        <button @click="() => (showMap = true)">
          {{ $t('message.open') }}
        </button>
      </section>

      <transition name="overlayPop">
        <div
          v-if="showOverlay && selectedShoreData"
          class="overlay-box-wrapper"
        >
          <overlay-box>
            <shore-info
              @delete-shore="hideShore"
              @show-reservationform="showReservationForm = true"
              @show-cleanform="showCleaned = true"
              :data="selectedShoreData"
            />
          </overlay-box>
        </div>
      </transition>
      <div v-if="showReservationForm">
        <transition name="modal">
          <Modal
            v-bind:selected="selectedShoreData"
            @reservation-action="saveContactInfo"
            @close="showReservationForm = false"
          >
          </Modal>
        </transition>
      </div>
      <div v-if="showCleaned">
        <transition name="modal">
          <CleanModal
            v-bind:selected="selectedShoreData"
            @close="showCleaned = false"
          >
          </CleanModal>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import OverlayBox from '@/components/OverlayBox'
import ShoreInfo from '@/components/ShoreInfo'
import MapView from '@/components/MapView'
import Modal from '@/components/Modal'
import CleanModal from '@/components/CleanModal'

import axios from 'axios'
export default {
  name: 'home',

  data() {
    return {
      showMap: false,
      startMapOnMounted: false,
      showCleaned: false,
      showReservationForm: false,
      // Overlay box
      showOverlay: false,
      dimBackground: true,
      // Selected Shore
      selectedShoreData: null
    }
  },

  components: {
    MapView,
    ShoreInfo,
    OverlayBox,
    Modal,
    CleanModal
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
    hideShore(json) {
      this.json = this.json.filter(function(item) {
        return item._key !== json._key
      })
      this.json2 = this.json2.filter(function(item) {
        return item._key !== json._key
      })
      const enhancedData2 = this.json2.map(d => ({
        ...d,
        properties: { ...d.properties, key: d._key }
      }))
      var data2 = {
        type: 'FeatureCollection',
        features: enhancedData2
      }

      const enhancedData = this.json.map(d => ({
        ...d,
        properties: { ...d.properties, key: d._key }
      }))
      var data = {
        type: 'FeatureCollection',
        features: enhancedData
      }
      this.map.getSource('reservedShore').setData(data2)
      this.map.getSource('freeShore').setData(data)
    },
    saveContactInfo(args) {
      axios({
        method: 'POST',
        url: 'http://' + location.hostname + ':8089/api/map/reserve',

        data: args.data
      }).then(response => {
        if (response.data.status === 'ok') {
          args.okCB()
        } else {
          args.errCB()
        }
      })
    },
    initMap() {
      this.$store.dispatch('getfreelayer')
      this.$store.dispatch('getreservedlayer')
      this.$store.dispatch('getcleanlayer')

      this.$nextTick(() => {
        this.showMap = this.startMapOnMounted
      })
    },

    toggleOverlay() {
      if (!this.selectedShoreData) {
        this.showOverlay = false
      }

      this.showOverlay = !this.showOverlay
    },
    toggleModal() {
      this.showModal = !this.showModal
    },

    populateSelectedShoreData(data) {
      this.selectedShoreData = data
      this.toggleOverlay()
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
  height: 100%;
}

.initial {
  background-color: #eae6e0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #4e4a45;

  h1 {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 2rem;
  }

  button {
    width: 20ex;
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
