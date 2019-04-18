<template>
  <div class="controlpanel-wrapper" @click="$emit('close')">
    <div class="controlpanel-container" @click.stop>
      <div class="clean-infos">
        <h1>Siivotut rannat</h1>
        <li class="clean-info" v-for="clean in cleaned" :key="clean._id">
          <div class="clean-time">
            <h3>Ajankohta</h3>
            <p>
              alkaa:
              {{ clean.date | moment('DD MMMM[ta] YYYY') }}
            </p>
          </div>
          <div class="cleanform-contact">
            <h3>Yhteystiedot</h3>
            <p>{{ clean.organizer_name }}</p>
            <p>{{ clean.leader_phone }}</p>
            <p>{{ clean.leader_email }}</p>
          </div>
          <div class="clean-cta">
            <button v-bind:id="clean.selected.key" v-on:click="showreservation">
              Näytä kartassa
            </button>

            <template v-if="clean.confirm">
              <button
                v-on:click="removecleaned($event, clean)"
                v-bind:id="clean.selected.key"
                class="red"
              >
                Peru Siivottu ranta
              </button>
            </template>
            <template v-if="!clean.confirm">
              <button
                v-on:click="addcleaned($event, clean)"
                v-bind:id="clean.selected.key"
                class="green"
              >
                Vahvista Siivottu ranta
              </button>
            </template>
          </div>
        </li>
      </div>
      <div class="reservations">
        <h1>Varaukset</h1>
        <li
          class="reservation"
          v-for="reservation in reservations"
          :key="reservation._id"
        >
          <div class="reservation-time">
            <h3>Ajankohta</h3>
            <p>
              alkaa:
              {{ reservation.startdate | moment('DD MMMM[ta] YYYY') }} klo
              {{ reservation.starttime }}
            </p>
            <p>
              päättyy:
              {{ reservation.enddate | moment('DD MMMM[ta] YYYY') }} klo
              {{ reservation.endtime }}
            </p>
          </div>
          <div class="reservation-contact">
            <h3>Yhteystiedot</h3>
            <p>{{ reservation.organizer }}</p>
            <p>{{ reservation.phonenumbery }}</p>
            <p>{{ reservation.email }}</p>
          </div>
          <div class="reservation-cta">
            <button
              v-bind:id="reservation.selected.key"
              v-on:click="showreservation"
            >
              Näytä kartassa
            </button>
            <template v-if="reservation.confirm">
              <button
                @click="removereservation($event, reservation)"
                v-bind:id="reservation.selected.key"
                class="red"
              >
                Peru varaus
              </button>
            </template>
            <template v-else>
              <button
                v-on:click="addreservation($event, reservation)"
                v-bind:id="reservation.selected.key"
                class="green"
              >
                Vahvista varaus
              </button>
            </template>
          </div>
        </li>
      </div>
      <div class="editor-wrapper">
        <div class="editor">
          Edit Map
          <button v-if="showunhide" @click="unHideShore">Paljasta ranta</button>
          <admin-map-box
            @map-loaded="mapLoaded"
            @shore-click="populateSelectedShoreData"
            @hidden-click="populateSelectedHideShoreData"
            v-bind:data="json"
            v-bind:data2="json2"
            v-bind:data3="json3"
            v-bind:data4="json4"
          />
        </div>
        <transition name="overlayPop">
          <div
            v-if="showOverlay && selectedShoreData"
            class="overlay-box-wrapper"
          >
            <overlay-box>
              <admin-shore-info
                @delete-shore="hideShore"
                :data="selectedShoreData"
              >
              </admin-shore-info>
            </overlay-box>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import OverlayBox from '@/components/OverlayBox'
import AdminShoreInfo from '@/components/AdminShoreInfo'
import AdminMapBox from '@/components/AdminMapBox'
import axios from 'axios'
export default {
  name: 'control',
  data() {
    return {
      reservations: {},
      json: {},
      json2: {},
      json3: {},
      json4: {},
      selected: {},
      showOverlay: false,
      showunhide: false,
      cleaned: {},
      selectedShoreData: {},
      selectedHideShoreData: {}
    }
  },
  components: {
    AdminShoreInfo,
    OverlayBox,
    AdminMapBox
  },
  methods: {
    saveCleaned() {},
    mapLoaded(map) {
      this.map = map
    },
    deleteHandler() {
      axios({
        method: 'POST',
        url:
          'http://' +
          location.hostname +
          ':8089/api/map/delete/' +
          this.data.key,
        data: { key: this.data.key }
      }).then(response => {
        this.hideShore(response.data.json)
      })
    },
    unHideShore() {
      let key = this.selectedHideShoreData.key
      axios({
        method: 'POST',
        url: 'http://' + location.hostname + ':8089/api/map/unhidebeach',
        data: { key: key }
      }).then(response => {
        this.showunhide = false
      })
    },
    hideShore(json) {
      console.log(json)
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
      this.map.getSource('shore2').setData(data2)
      this.map.getSource('shore').setData(data)
    },
    populateSelectedShoreData(data) {
      this.selectedShoreData = data
      this.toggleOverlay()
    },
    populateSelectedHideShoreData(data) {
      this.selectedHideShoreData = data
      this.showunhide = true
    },
    toggleOverlay() {
      if (!this.selectedShoreData) {
        this.showOverlay = false
      }
      this.showOverlay = !this.showOverlay
    },
    generateLineStringStyle() {
      return {
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#FF00FF',
          'line-width': 5
        }
      }
    },
    addreservation(e, reservation) {
      var id = e.target.id

      axios
        .post('http://' + location.hostname + ':8089/api/map/cleanbeach/', {
          key: id,
          reservation: reservation._key
        })
        .then(function(response) {
          console.log(response)
          if (response.data.status === 'ok') {
            reservation.confirm = true
            alert('reserved')
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    removecleaned(e, cleaned) {
      axios
        .post(
          'http://' + location.hostname + ':8089/api/map/cancelcleanedbeach/',
          {
            key: e.target.id,
            clean: cleaned._key
          }
        )
        .then(function(response) {
          console.log(response)
          if (response.data.status === 'ok') {
            cleaned.confirm = false
            alert('canceled')
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    removereservation(e, reservation) {
      axios
        .post(
          'http://' + location.hostname + ':8089/api/map/cancelcleanbeach/',
          {
            key: e.target.id,
            reservation: reservation._key
          }
        )
        .then(function(response) {
          console.log(response)
          if (response.data.status === 'ok') {
            reservation.confirm = false
            alert('canceled')
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    addcleaned(e, clean) {
      alert(e.target.id)
      clean.confirm = true
      var id = e.target.id
      axios
        .post('http://' + location.hostname + ':8089/api/map/clean/', {
          key: id,
          clean: clean._key
        })
        .then(function(response) {
          console.log(response)
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    showreservation(e) {
      var id = e.target.id
      //get shore and show on map
      fetch(
        'http://' + location.hostname + ':8089/api/map/shore/' + e.target.id
      )
        .then(response => {
          return response.json()
        })
        .then(shores => {
          this.selected = shores.data
          var data = {
            type: 'FeatureCollection',
            features: [this.selected]
          }
          var mapLayer = this.map.getLayer('shore4')

          if (typeof mapLayer !== 'undefined') {
            // Remove map layer & source.
            this.map.removeLayer('shore4').removeSource('shore4')
          }

          this.map.addSource('shore4', { type: 'geojson', data: data })
          this.map.addLayer({
            id: 'shore4',
            type: 'line',
            source: 'shore4',
            ...this.generateLineStringStyle()
          })

          console.log(this.map)
          this.map.flyTo({
            center: [
              shores.data.geometry.coordinates[0][0],
              shores.data.geometry.coordinates[0][1]
            ],
            zoom: 15
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
    initMap() {
      fetch('http://' + location.hostname + ':8089/api/map/shores')
        .then(response => {
          return response.json()
        })
        .then(shores => {
          this.json = shores.data
        })
        .catch(error => {
          console.log(error)
        })
      fetch('http://' + location.hostname + ':8089/api/map/shores/reserved')
        .then(response => {
          return response.json()
        })
        .then(shores => {
          this.json2 = shores.data
        })
        .catch(error => {
          console.log(error)
        })
      fetch('http://' + location.hostname + ':8089/api/map/shores/cleaned')
        .then(response => {
          return response.json()
        })
        .then(shores => {
          this.json3 = shores.data
        })
        .catch(error => {
          console.log(error)
        })
      fetch('http://' + location.hostname + ':8089/api/map/shores/hidden')
        .then(response => {
          return response.json()
        })
        .then(shores => {
          this.json4 = shores.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    getReservations() {
      fetch('http://' + location.hostname + ':8089/api/map/reservations/')
        .then(response => {
          return response.json()
        })
        .then(reservation => {
          this.reservations = reservation.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    getCleaned() {
      fetch('http://' + location.hostname + ':8089/api/map/cleaninfos/')
        .then(response => {
          return response.json()
        })
        .then(reservation => {
          this.cleaned = reservation.data
        })
        .catch(error => {
          console.log(error)
        })
    }
  },

  mounted() {
    this.getReservations()
    this.getCleaned()
    this.initMap()
  }
}
</script>

<style lang="scss" scoped>
.controlpanel-container {
  width: 100%;
  height: 100%;
  background-color: white;
  display: flex;
  justify-content: space-between;

  button.green {
    border-color: green;
  }
  button.red {
    border-color: red;
  }
  .reservations {
    .reservation {
      padding: 5px;

      .reservation-time {
        padding: 5px;
      }

      .reservation-contact {
        padding: 5px;
      }
    }
  }

  h3 {
    font-weight: bold;
  }

  h1 {
    font-weight: bold;
  }

  .editor-wrapper {
    position: relative;

    .overlay-box-wrapper {
      position: absolute;
      bottom: 100px;
      left: 110px;
    }
  }
}
</style>
