<template>
  <div class="home">
    <div class="map-container">
      <div class="dimmer" v-if="showOverlay" @click="toggleOverlay" />
      <map-view
        v-bind:data="json"
        v-bind:data2="json2"
        v-if="showMap"
        @map-loaded="mapLoaded"
        @shore-click="populateSelectedShoreData"
      />
      <section v-else class="initial">
        <h1>Avataanko Karttanäkymä?</h1>
        <button @click="() => (showMap = true)">Avaa</button>
      </section>
      <transition name="overlayPop">
        <div
          v-if="showOverlay && selectedShoreData"
          class="overlay-box-wrapper"
        >
          <overlay-box>
            <shore-info
              @reserve-intention="saveReservation"
              :data="selectedShoreData"
            />
          </overlay-box>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import OverlayBox from '@/components/OverlayBox'
import ShoreInfo from '@/components/ShoreInfo'
import MapView from '@/components/MapView'
import axios from 'axios'
export default {
  name: 'home',

  data() {
    return {
      // Map
      json: {},
      json2: {},
      showMap: false,
      startMapOnMounted: false,
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
    OverlayBox
  },

  methods: {
    generateLineStringStyle() {
      return {
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#475DCC',
          'line-width': 5
        }
      }
    },
    mapLoaded(map) {
      console.log(map)
      this.map = map
    },

    saveReservation(json) {
      console.log(json._key)
      this.json2.push(json)
      console.log(this.json2)
      const enhancedData2 = this.json2.map(d => ({
        ...d,
        properties: { ...d.properties, key: d._key }
      }))
      var data = {
        type: 'FeatureCollection',
        features: enhancedData2
      }
      this.map.removeLayer('shore')
      this.map.removeSource('shore')

      this.json = this.json.filter(function(item) {
        return item._key !== json._key
      })
      console.log(this.json)
      this.map.getSource('shore2').setData(data)
      const enhancedData = this.json.map(d => ({
        ...d,
        properties: { ...d.properties, key: d._key }
      }))
      data = {
        type: 'FeatureCollection',
        features: enhancedData
      }
      this.map.addSource('shore', { type: 'geojson', data: data })

      this.map.addLayer({
        id: 'shore',
        type: 'line',
        source: 'shore',
        ...this.generateLineStringStyle()
      })

      console.log(this.map)
    },
    initMap() {
      fetch('http://192.168.50.68:8089/api/map/shores')
        .then(response => {
          return response.json()
        })
        .then(shores => {
          console.log(shores.data)
          this.json = shores.data
        })
        .catch(error => {
          console.log(error)
        })
      fetch('http://192.168.50.68:8089/api/map/shores/reserved')
        .then(response => {
          return response.json()
        })
        .then(shores => {
          console.log(shores.data)
          this.json2 = shores.data
        })
        .catch(error => {
          console.log(error)
        })
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
