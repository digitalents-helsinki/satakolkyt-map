<template>
  <div
    v-if="this.login_token"
    class="controlpanel-wrapper"
    @click="$emit('close')"
  >
    <app-footer
      adminmode="true"
      :data="selectedShoreData"
      :action="mapOverlayAction"
      @hide-shore="shoreHidden"
      @unhide-shore="shoreUnhidden"
    />

    <!-- <div class="controlpanel-container" @click.stop>
     -->

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
        </div>
      </div>
      <div class="list-wrapper">
        <div class="list-tabs">
          <div class="tab" @click="toggleReservationList">
            <h1>{{ $t('message.reservations') }}</h1>
          </div>
          <div class="tab" @click="toggleCleanedShoresList">
            <h1>{{ $t('message.cleaned') }}</h1>
          </div>
        </div>
        <div class="tab-content">
          <div class="reservations" v-show="showReservations">
            <li
              class="reservation"
              v-for="reservation in reservations"
              :key="reservation._id"
            >
              <div class="reservation-time">
                <h3>{{ $t('message.date') }}</h3>
                <p>
                  {{ $t('message.starts') }}:
                  <template v-if="$i18n.locale != 'fi'">
                    {{ reservation.startdate | moment('DD MMMM YYYY') }}
                  </template>
                  <template v-else>
                    {{ reservation.startdate | moment('DD MMMM[ta] YYYY') }} klo
                  </template>
                  {{ reservation.starttime }}
                </p>
                <p>
                  {{ $t('message.ends') }}:
                  <template v-if="$i18n.locale != 'fi'">
                    {{ reservation.enddate | moment('DD MMMM YYYY') }}
                  </template>
                  <template v-else>
                    {{ reservation.enddate | moment('DD MMMM[ta] YYYY') }} klo
                  </template>
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
                  class="small-button show-button"
                  v-bind:id="reservation.selected.key"
                  v-on:click="showreservation"
                >
                  {{ $t('message.show_map') }}
                </button>
                <button
                  class="small-button del-button"
                  @click="deletereservation($event, reservation)"
                  v-bind:id="reservation.selected.key"
                >
                  {{ $t('message.delete_reservation') }}
                </button>
                <template v-if="reservation.confirmed">
                  <button
                    class="small-button cancel-button"
                    @click="removereservation($event, reservation)"
                    v-bind:id="reservation.selected.key"
                  >
                    {{ $t('message.cancel_reservation') }}
                  </button>
                </template>
                <template v-else>
                  <button
                    class="small-button confirm-button"
                    v-on:click="confirmreservation($event, reservation)"
                    v-bind:id="reservation.selected.key"
                  >
                    {{ $t('message.confirm_reservation') }}
                  </button>
                </template>
              </div>
            </li>
          </div>
          <div class="clean-infos" v-show="showCleanedShores">
            <li class="clean-info" v-for="clean in cleaned" :key="clean._id">
              <div class="clean-time">
                <h3>{{ $t('message.date') }}</h3>
                <p>
                  {{ $t('message.starts') }}:
                  <template v-if="$i18n.locale != 'fi'">
                    {{ clean.date | moment('DD MMMM YYYY') }}
                  </template>
                  <template v-else>
                    {{ clean.date | moment('DD MMMM[ta] YYYY') }} klo
                  </template>
                </p>
              </div>
              <div class="cleanform-contact">
                <h3>{{ $t('message.contact_info') }}</h3>
                <p>{{ clean.organizer_name }}</p>
                <p>{{ clean.leader_phone }}</p>
                <p>{{ clean.leader_email }}</p>
              </div>
              <div class="clean-cta">
                <button
                  class="small-button show-button"
                  v-bind:id="clean.selected.key"
                  v-on:click="showreservation"
                >
                  {{ $t('message.show_map') }}
                </button>

                <template v-if="clean.confirm">
                  <button
                    class="small-button confirm-button"
                    v-on:click="removecleaned($event, clean)"
                    v-bind:id="clean.selected.key"
                  >
                    {{ $t('message.cancel_cleaned') }}
                  </button>
                </template>
                <template v-if="!clean.confirm">
                  <button
                    class="small-button cancel-button"
                    v-on:click="addcleaned($event, clean)"
                    v-bind:id="clean.selected.key"
                  >
                    {{ $t('message.confirm_cleaned') }}
                  </button>
                </template>
              </div>
            </li>
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
//import AdminMapBox from '@/components/AdminMapBox'
import ShoreMap from '@/components/ShoreMap'
import AppFooter from '@/components/AppFooter'

import axios from 'axios'
export default {
  name: 'control',
  data() {
    return {
      adminmode: true,
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
      mapOverlayAction: null,
      showReservations: false,
      showCleanedShores: false
    }
  },
  components: {
    AppFooter,
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
    mapLoaded(map) {
      this.map = map
    },
    populateSelectedShoreData(data) {
      this.selectedShoreData = data
      this.mapOverlayAction = 'hide'
      this.toggleOverlay()
    },
    populateSelectedHiddenShoreData(data) {
      this.selectedShoreData = data
      this.mapOverlayAction = 'unhide'
      this.toggleOverlay()
    },
    toggleReservationList() {
      this.showCleanedShores = false
      this.showReservations = !this.showReservations
    },
    toggleCleanedShoresList() {
      this.showReservations = false
      this.showCleanedShores = !this.showCleanedShores
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
      this.mapOverlayAction = 'unhide'
      //add the feature to hidden shore data
      this.addSegmentToLayer('hiddenShore', 'hiddenlayer', data)
    },
    shoreUnhidden(data) {
      this.toggleOverlay()
      this.map.removeLayer('hiddenShoreSelected')
      this.map.removeSource('hiddenShoreSelected')
      this.mapOverlayAction = 'hide'
      this.removeSegmentFromLayer('hiddenShore', 'hiddenlayer', data._key)
      this.addSegmentToLayer('freeShore', 'freelayer', data)
    },
    toggleOverlay() {
      if (!this.selectedShoreData) {
        this.showOverlay = false
      }
      this.showOverlay = !this.showOverlay
    },
    confirmreservation(e, reservation) {
      var id = e.target.id
      axios({
        method: 'POST',
        url:
          'http://' + location.hostname + ':8089/api/map/confirmreservation/',

        data: { key: id, reservation: reservation._key }
      })
        .then(response => {
          console.log(response)
          if (response.data.status === 'ok') {
            reservation.confirmed = true
            this.shoreReserved(response.data.json)
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
        .then(response => {
          console.log(response)
          if (response.data.status === 'ok') {
            cleaned.confirm = false
            this.shoreCleanedCanceled(response.data.json)
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
      axios
        .post(
          'http://' + location.hostname + ':8089/api/map/cancelreservation/',
          {
            key: e.target.id,
            reservation: reservation._key
          }
        )
        .then(response => {
          console.log(response)
          if (response.data.status === 'ok') {
            reservation.confirmed = false
            this.shoreUnreserved(response.data.json)
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    addcleaned(e, clean) {
      var id = e.target.id
      axios
        .post('http://' + location.hostname + ':8089/api/map/clean/', {
          key: id,
          clean: clean._key
        })
        .then(response => {
          console.log(response)
          clean.confirm = true
          this.shoreCleaned(response.data.json)
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    shoreCleaned(data) {
      this.removeSegmentFromLayer('freeShore', 'freelayer', data._key)
      this.addSegmentToLayer('cleanedShore', 'cleanlayer', data)
    },
    shoreCleanedCanceled(data) {
      this.removeSegmentFromLayer('cleanedShore', 'cleanlayer', data._key)
      this.addSegmentToLayer('freeShore', 'freelayer', data)
    },
    showreservation(e) {
      const id = e.target.id
      const confirmed = this.reservations.find(e => {
        return e.selected.key === id
      }).confirmed
      console.log(confirmed)
      const layer = confirmed ? 'reservedlayer' : 'freelayer'
      const data = this.$store.state.maplayers[layer].find(e => {
        return e._key === id
      })
      const featcoll = {
        type: 'FeatureCollection',
        features: [data]
      }
      const sourcename = confirmed
        ? 'reservedShoreSelected'
        : 'freeShoreSelected'
      const paintcolor = confirmed ? '#FF7575' : '#8595E5'
      const selShSource = this.map.getSource(sourcename)
      if (!selShSource) {
        this.map.addSource(sourcename, {
          type: 'geojson',
          data: featcoll
        })
        this.map.addLayer({
          id: sourcename,
          type: 'line',
          source: sourcename,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': paintcolor,
            'line-width': 1
          }
        })
      } else {
        selShSource.setData(featcoll)
      }

      this.map.flyTo({
        center: [
          data.geometry.coordinates[0][0],
          data.geometry.coordinates[0][1]
        ],
        zoom: 17
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
.controlpanel-wrapper {
  width: 100%;
  height: 100%;
  background-color: white;
  display: flex;
  justify-content: space-between;

  h3 {
    font-weight: bold;
  }

  h1 {
    font-weight: bold;
  }

  .editor-wrapper {
    position: relative;

    .editor {
      position: relative;

      .adminMapContainer {
        height: 100vh;
        width: 100vw;
      }
    }

    .list-wrapper {
      position: absolute;
      top: 100px;
      left: 30px;

      .list-tabs {
        display: flex;

        .tab {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 150px;
          height: 50px;
          background-color: white;
          border: 1px solid #bbb;
          border-bottom: none;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          cursor: pointer;

          &:hover {
            background-color: #eee;
          }
        }
      }

      .tab-content {
        width: 400px;
        max-height: 70vh;
        background-color: white;
        overflow-y: auto;
      }

      .reservations {
        width: 350px;
        margin: 0 auto;

        .reservation {
          padding: 10px 10px 20px 10px;
          border-bottom: 1px solid #bbb;

          .reservation-time {
            padding: 5px;
          }

          .reservation-contact {
            padding: 5px;
          }

          .reservation-cta {
            display: flex;
          }
        }
      }

      .clean-infos {
        width: 300px;
        margin: 0 auto;

        .clean-info {
          padding: 10px 10px 20px 10px;
          border-bottom: 1px solid #bbb;
        }
      }
    }

    .overlay-box-wrapper {
      position: absolute;
      bottom: 30px;
      left: 110px;
    }
  }
}

.small-button {
  min-width: 50px;
  max-width: 120px;
  font-size: 12px;
  padding: 10px;
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
