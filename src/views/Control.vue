<template>
  <div
    v-if="this.login_token"
    class="controlpanel-wrapper"
    @click="$emit('close')"
  >
    <div class="controlpanel-container" @click.stop>
      <div class="clean-infos">
        <h1>{{ $t('message.cleaned') }}</h1>
        <li class="clean-info" v-for="clean in cleaned" :key="clean._id">
          <div class="clean-time">
            <h3>{{ $t('message.date') }}</h3>
            <p>
              {{ $t('message.starts') }}:
              {{ clean.date | moment('DD MMMM[ta] YYYY') }}
            </p>
          </div>
          <div class="cleanform-contact">
            <h3>{{ $t('message.contact_info') }}</h3>
            <p>{{ clean.organizer_name }}</p>
            <p>{{ clean.leader_phone }}</p>
            <p>{{ clean.leader_email }}</p>
          </div>
          <div class="clean-cta">
            <button v-bind:id="clean.selected.key" v-on:click="showreservation">
              {{ $t('message.show_map') }}
            </button>

            <template v-if="clean.confirm">
              <button
                v-on:click="removecleaned($event, clean)"
                v-bind:id="clean.selected.key"
                class="red"
              >
                {{ $t('message.cancel_cleaned') }}
              </button>
            </template>
            <template v-if="!clean.confirm">
              <button
                v-on:click="addcleaned($event, clean)"
                v-bind:id="clean.selected.key"
                class="green"
              >
                {{ $t('message.confirm_cleaned') }}
              </button>
            </template>
          </div>
        </li>
      </div>
      <div class="reservations">
        <h1>{{ $t('message.reservations') }}</h1>
        <li
          class="reservation"
          v-for="reservation in reservations"
          :key="reservation._id"
        >
          <div class="reservation-time">
            <h3>{{ $t('message.date') }}</h3>
            <p>
              {{ $t('message.starts') }}:
              {{ reservation.startdate | moment('DD MMMM[ta] YYYY') }} klo
              {{ reservation.starttime }}
            </p>
            <p>
              {{ $t('message.ends') }}:
              {{ reservation.enddate | moment('DD MMMM[ta] YYYY') }} klo
              {{ reservation.endtime }}
            </p>
          </div>
          <div class="reservation-contact">
            <h3>{{ $t('message.contact_info') }}</h3>
            <p>{{ reservation.organizer }}</p>
            <p>{{ reservation.phonenumbery }}</p>
            <p>{{ reservation.email }}</p>
          </div>
          <div class="reservation-cta">
            <button
              v-bind:id="reservation.selected.key"
              v-on:click="showreservation"
            >
              {{ $t('message.show_map') }}
            </button>
            <button
              @click="deletereservation($event, reservation)"
              v-bind:id="reservation.selected.key"
              class="red"
            >
              {{ $t('message.delete_reservation') }}
            </button>
            <template v-if="reservation.confirm">
              <button
                @click="removereservation($event, reservation)"
                v-bind:id="reservation.selected.key"
                class="red"
              >
                {{ $t('message.cancel_reservation') }}
              </button>
            </template>
            <template v-else>
              <button
                v-on:click="addreservation($event, reservation)"
                v-bind:id="reservation.selected.key"
                class="green"
              >
                {{ $t('message.confirm_reservation') }}
              </button>
            </template>
          </div>
        </li>
      </div>
      <div class="editor-wrapper">
        <div class="editor">
          {{ $t('message.edit_map') }}
          <div class="adminMapContainer">
            <shore-map
              adminmode
              @map-loaded="mapLoaded"
              @shore-click="populateSelectedShoreData"
              @hidden-click="populateSelectedHiddenShoreData"
              :freeshores="this.$store.state.maplayers.freelayer"
              :reservedshores="this.$store.state.maplayers.reservedlayer"
              :cleanedshores="this.$store.state.maplayers.cleanlayer"
              :hiddenshores="this.$store.state.maplayers.hiddenlayer"
            />
            <transition name="overlayPop">
              <div
                v-if="showOverlay && selectedShoreData"
                class="overlay-box-wrapper"
              >
                <overlay-box>
                  <admin-shore-info
                    :data="selectedShoreData"
                    :action="mapOverlayAction"
                    @hide-shore="shoreHidden"
                    @unhide-shore="shoreUnhidden"
                  >
                  </admin-shore-info>
                </overlay-box>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <form class="form" v-on:submit.prevent="signin">
      <label for="username">username</label>
      <input
        id="username"
        v-model="login.username"
        type="text"
        name=""
        value=""
      />
      <label for="password">password</label>
      <input
        id="password"
        v-model="login.password"
        type="password"
        name=""
        value=""
      />
      <button type="submit" name="">Login</button>
    </form>
  </div>
</template>

<script>
import OverlayBox from '@/components/OverlayBox'
import AdminShoreInfo from '@/components/AdminShoreInfo'
//import AdminMapBox from '@/components/AdminMapBox'
import ShoreMap from '@/components/ShoreMap'
import axios from 'axios'
export default {
  name: 'control',
  data() {
    return {
      reservations: {},
      selected: {},
      login_token: false,
      login: {
        username: '',
        password: ''
      },
      showOverlay: false,
      showunhide: false,
      cleaned: {},
      selectedShoreData: {},
      mapOverlayAction: null
    }
  },
  components: {
    AdminShoreInfo,
    OverlayBox,
    //AdminMapBox
    ShoreMap
  },
  methods: {
    signin() {
      axios
        .post('http://' + location.hostname + ':8089/api/map/login/', {
          username: this.login.username,
          password: this.login.password
        })
        .then(response => {
          this.login_token = response.data.token
          axios.defaults.headers.common['authorization'] = this.login_token
          this.getReservations()
          this.getCleaned()
          this.initMap()
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    saveCleaned() {},
    mapLoaded(map) {
      this.map = map
    },
    populateSelectedShoreData(data) {
      this.selectedShoreData = data
      console.log(this.selectedShoreData)
      this.mapOverlayAction = 'hide'
      this.toggleOverlay()
    },
    populateSelectedHiddenShoreData(data) {
      this.selectedShoreData = data
      this.mapOverlayAction = 'unhide'
      this.toggleOverlay()
    },
    enhanceData(data) {
      //apparently without this the data format is somehow wrong
      return data.map(e => ({
        ...e,
        properties: { ...e.properties, key: e._key }
      }))
    },
    removeSegmentFromLayer(mapname, vuexname, segKey) {
      const newshores = this.$store.state.maplayers[vuexname].filter(e => {
        return e._key !== segKey
      })
      this.$store.commit('store' + vuexname, newshores)
      this.map.getSource(mapname).setData({
        type: 'FeatureCollection',
        features: this.enhanceData(newshores)
      })
    },
    addSegmentToLayer(mapname, vuexname, segData) {
      let newshores = this.$store.state.maplayers[vuexname]
      newshores.push(segData)
      this.$store.commit('store' + vuexname, newshores)
      this.map.getSource(mapname).setData({
        type: 'FeatureCollection',
        features: this.enhanceData(newshores)
      })
    },
    shoreHidden(data) {
      this.toggleOverlay()
      //remove selected layers
      this.map.removeLayer('freeShoreSelected')
      this.map.removeSource('freeShoreSelected')

      //filter the feature from free shores data
      this.removeSegmentFromLayer('freeShore', 'freelayer', data._key)

      //add the feature to hidden shore data
      this.addSegmentToLayer('hiddenShore', 'hiddenlayer', data)
    },
    shoreUnhidden(data) {
      this.toggleOverlay()
      this.map.removeLayer('hiddenShoreSelected')
      this.map.removeSource('hiddenShoreSelected')

      this.removeSegmentFromLayer('hiddenShore', 'hiddenlayer', data._key)
      this.addSegmentToLayer('freeShore', 'freelayer', data)
    },
    toggleOverlay() {
      if (!this.selectedShoreData) {
        this.showOverlay = false
      }
      this.showOverlay = !this.showOverlay
    },
    addreservation(e, reservation) {
      var id = e.target.id
      const self = this
      axios({
        method: 'POST',
        url: 'http://' + location.hostname + ':8089/api/map/cleanbeach/',

        data: { key: id, reservation: reservation._key }
      })
        .then(function(response) {
          console.log(response)
          if (response.data.status === 'ok') {
            reservation.confirm = true
            self.shoreReserved(response.data.json)
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    shoreReserved(data) {
      this.removeSegmentFromLayer('freeShore', 'freelayer', data._key)
      this.addSegmentToLayer('reservedShore', 'reservedlayer', data)
    },
    shoreUnreserved(data) {
      this.removeSegmentFromLayer('reservedShore', 'reservedlayer', data._key)
      this.addSegmentToLayer('freeShore', 'freelayer', data)
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
    deletereservation(e, reservation) {
      axios.delete(
        'http://' + location.hostname + ':8089/api/map/reservation',
        { data: { id: reservation._key, key: e.target.id } }
      )
    },
    removereservation(e, reservation) {
      const self = this
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
            self.shoreUnreserved(response.data.json)
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
      this.$store.dispatch('getfreelayer')
      this.$store.dispatch('getreservedlayer')
      this.$store.dispatch('getcleanlayer')
      this.$store.dispatch('gethiddenlayer')
    },
    getReservations() {
      axios
        .get('http://' + location.hostname + ':8089/api/map/reservations/')
        .then(reservation => {
          this.reservations = reservation.data.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    getCleaned() {
      axios
        .get('http://' + location.hostname + ':8089/api/map/cleaninfos/')
        .then(reservation => {
          this.cleaned = reservation.data.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    gettoken() {
      axios
        .post('http://' + location.hostname + ':8089/api/map/authcheck', {})
        .then(response => {
          if (response.data.success) {
            alert('success')
          }
        })
        .catch(error => {
          alert(error)
        })
    }
  },

  mounted() {
    /*
    this.getReservations()
    this.getCleaned()
    this.initMap()
    */
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

    .adminMapContainer {
      position: relative;
      width: 500px;
      height: 500px;
    }

    .overlay-box-wrapper {
      position: absolute;
      bottom: 30px;
      left: 110px;
    }
  }
}
.form {
  position: fixed;
  top: 10%;
  left: 46%;
  width: 250px;
  padding: 20px;
  border: 5px dotted grey;
}

input[type='text'],
input[type='password'] {
  padding: 15px;
  margin-bottom: 20px;
  display: block;
  border: none;
  background: #f1f1f1;
}

input[type='text']:focus,
input[type='password']:focus {
  background-color: #ddd;
  outline: none;
}
</style>
