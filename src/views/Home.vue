<template>
  <div class="home">
    <vue-headful :title="$t('message.app')" />
    <div class="map-container">
      <div class="dimmer" v-if="showReservationForm" @click="toggleModal" />
      <shore-map
        :freeshores="this.$store.state.maplayers.freelayer"
        :reservedshores="this.$store.state.maplayers.reservedlayer"
        :cleanedshores="this.$store.state.maplayers.cleanlayer"
        :hiddenshores="this.$store.state.maplayers.hiddenlayer"
        v-if="showMap"
        @map-loaded="mapLoaded"
        @shore-click="populateSelectedShoreData"
        @reserved-click="selectReserved"
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
        @delete-shore="hideShore"
        @show-reservationform="showReservationForm = true"
        @show-cleanform="showCleaned = true"
        :data="selectedShoreData"
        :showReservation="showReservationForm"
      />
      <div v-if="showReservedInfo" class="reserved-info">
        <h1>Varattu ranta</h1>
        <p><b>Organizer:</b> {{ reservedInfo.organizer }}</p>
        <p><b>Avoin?:</b> {{ reservedInfo.openevent ? 'Kyllä' : 'Ei' }}</p>
        <template v-if="reservedInfo.openevent">
          <p><b>Event info:</b> {{ reservedInfo.openinfo }}</p>
          <p><b>Event link:</b> {{ reservedInfo.openlink }}</p>
        </template>
        <p>
          <b>Alkaa:</b>
          {{ reservedInfo.startdate + ' ' + reservedInfo.starttime }}
        </p>
        <p>
          <b>Loppuu:</b> {{ reservedInfo.enddate + ' ' + reservedInfo.endtime }}
        </p>
      </div>
      <div v-if="showReservationForm">
        <transition name="modal">
          <ReserveModal
            v-bind:selected="selectedShoreData"
            @reservation-action="saveContactInfo"
            @close="showReservationForm = false"
          >
          </ReserveModal>
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
//import MapView from '@/components/MapView'
import ShoreMap from '@/components/ShoreMap'
import ReserveModal from '@/components/ReserveModal'
import CleanModal from '@/components/CleanModal'
import AppFooter from '@/components/AppFooter'
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
      // Overlay box
      dimBackground: true,
      // Selected Shore
      selectedShoreData: null
    }
  },

  components: {
    //MapView,
    ShoreMap,
    ReserveModal,
    CleanModal,
    AppFooter
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
      })
        .then(response => {
          if (response.data.status === 'ok') {
            args.okCB()
          } else {
            args.errCB(response.data.status)
          }
        })
        .catch(error => {
          args.errCB(error.response.data)
        })
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
    populateSelectedShoreData(data) {
      this.selectedShoreData = data
    },
    unselectShore() {
      this.selectedShoreData = null
      this.showReservedInfo = false
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
  position: relative;
  height: 100%;

  .reserved-info {
    position: absolute;
    bottom: 150px;
    left: 50px;
    width: 300px;
    height: 200px;
    background-color: white;
    padding: 10px;

    h1 {
      text-align: center;
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 10px;
    }

    p {
      margin: 5px 0;
    }
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
