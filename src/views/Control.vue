// Copyright (C) 2019 Digitalents Helsinki

<template>
  <div
    v-if="this.login_token"
    class="controlpanel-wrapper"
    @click="$emit('close')"
  >
    <div class="editor-wrapper">
      <div class="editor">
        <div class="adminMapContainer">
          <shore-map
            :key="mapkey"
            ref="adminmap"
            adminmode
            @map-loaded="mapLoaded"
            @free-click="populateSelectedShoreData"
            @hidden-click="populateSelectedHiddenShoreData"
            @cleaned-click="scrollToClickedCleanShore"
            :showOnMap="showOnMap"
            :freeshores="this.$store.state.maplayers.freelayer"
            :reservedshores="this.$store.state.maplayers.reservedlayer"
            :cleanedshores="this.$store.state.maplayers.cleanlayer"
            :hiddenshores="this.$store.state.maplayers.hiddenlayer"
          />
        </div>
      </div>

      <div class="list-wrapper">
        <div class="list-tabs">
          <div
            :class="showReservations ? 'tab-active' : 'tab'"
            @click="toggleReservationList"
          >
            <h1>{{ $t('message.reservations') }}</h1>
          </div>
          <div
            :class="showCleanedShores ? 'tab-active' : 'tab'"
            @click="toggleCleanedShoresList"
          >
            <h1>{{ $t('message.cleaned') }}</h1>
          </div>
        </div>
        <div class="list-control">
          <div class="hide-confirmed">
            <label for="hideconfirmed"
              >{{ $t('message.hide_confirmed') }}:
            </label>
            <input type="checkbox" id="hideconfirmed" v-model="hideConfirmed" />
          </div>
          <button class="small-button" @click="toggleSort">
            {{
              newestfirst ? $t('message.old_first') : $t('message.new_first')
            }}
          </button>
        </div>
        <div class="tab-content">
          <div class="reservations" v-show="showReservations">
            <div class="remove-old-reservations">
              <button @click="removeOldReservations">
                {{ $t('message.remove_old_reservations') }}
              </button>
            </div>
            <li
              class="reservation"
              :class="{
                confirmed: reservation.confirmed,
                unconfirmed: !reservation.confirmed
              }"
              v-for="reservation in reservations"
              :key="reservation._id"
              v-show="
                !reservation.confirmed ||
                  !(reservation.confirmed && hideConfirmed)
              "
            >
              <h2 class="reservation-organizer">{{ reservation.organizer }}</h2>
              <div class="reservation-time">
                <p>
                  <span class="bold">{{ $t('message.date') }}: </span>
                  {{ reservation.startdate | moment('DD.MM.YYYY') }}
                  {{ reservation.starttime + ' - ' + reservation.endtime }}
                </p>
              </div>
              <div class="reservation-contact">
                <p>
                  <span class="bold">{{ $t('message.name') }}</span
                  >: {{ reservation.name }}
                </p>
                <p>
                  <span class="bold">{{ $t('message.phonenumber') }}</span
                  >: {{ reservation.phonenumber }}
                </p>
                <p>
                  <span class="bold">{{ $t('message.email') }}</span
                  >: {{ reservation.email }}
                </p>
              </div>

              <div v-if="reservation.openevent" class="reservation-open">
                <h3>{{ $t('message.type_open') }}</h3>
                <p>{{ reservation.openinfo }}</p>
                <p>{{ reservation.openlink }}</p>
              </div>

              <div class="reservation-cta">
                <button
                  class="small-button show-button"
                  :id="reservation.selected.key"
                  @click="showreservation"
                >
                  {{ $t('message.show_map') }}
                </button>

                <button
                  class="small-button del-button"
                  @click="openDeleteReservationConfirmation(reservation)"
                >
                  {{ $t('message.delete_reservation') }}
                </button>

                <div v-if="reservation.confirmed">
                  <button
                    class="small-button cancel-button"
                    @click="cancelReservation($event, reservation)"
                    :id="reservation.selected.key"
                  >
                    {{ $t('message.cancel_reservation') }}
                  </button>
                </div>
                <div v-else>
                  <button
                    class="small-button confirm-button"
                    @click="confirmReservation($event, reservation)"
                    :id="reservation.selected.key"
                  >
                    {{ $t('message.confirm_reservation') }}
                  </button>
                </div>
              </div>
            </li>
          </div>
          <div class="clean-infos" v-show="showCleanedShores">
            <div class="remove-old-cleaninfos">
              <button @click="removeOldCleaninfos">
                {{ $t('message.remove_old_cleanings') }}
              </button>
            </div>
            <div class="show-invasive">
              <label for="showinvasiveonly"
                >Näytä vain vieraslajitietoja sisältävät:
              </label>
              <input
                type="checkbox"
                id="showinvasiveonly"
                v-model="invasiveonly"
              />
            </div>
            <li
              class="clean-info"
              :class="{
                confirmed: clean.confirmed,
                unconfirmed: !clean.confirmed
              }"
              :ref="`cleanedShore_${clean.selected.key}`"
              v-for="clean in cleaned"
              :key="clean._id"
              v-show="shouldShowClean(clean)"
            >
              <h2>{{ clean.organizer_name }}</h2>
              <div class="clean-time">
                <p>
                  <span class="bold">{{ $t('message.time_clean') }}: </span>
                  {{ clean.date | moment('DD.MM.YYYY') }}
                </p>
                <p>
                  <span class="bold">{{ $t('message.group_size') }}: </span
                  >{{ clean.group_size }}
                </p>
              </div>

              <div class="clean-contact">
                <p>
                  <span class="bold">{{ $t('message.name') }}</span
                  >: {{ clean.leader_name }}
                </p>
                <p>
                  <span class="bold">{{ $t('message.phonenumber') }}</span
                  >: {{ clean.leader_phone }}
                </p>
                <p>
                  <span class="bold">{{ $t('message.email') }}</span
                  >: {{ clean.leader_email }}
                </p>
              </div>

              <div class="clean-trash">
                <p>
                  <span class="bold">{{ $t('message.trash_amount') }}:</span>
                  {{
                    [
                      $t('message.trash_little'),
                      $t('message.trash_small'),
                      $t('message.trash_medium'),
                      $t('message.trash_large')
                    ][clean.trash_amount]
                  }}
                </p>
                <p>
                  <span class="bold">{{ $t('message.bags_to_collect') }}:</span>
                  {{
                    clean.trash_left === 'yes'
                      ? $t('message.yes')
                      : $t('message.no')
                  }}
                </p>
                <p v-if="clean.trash_left === 'yes'">
                  {{ clean.trash_bags_info }}
                </p>
              </div>

              <div class="clean-plants">
                <p>
                  <span class="bold">{{ $t('message.kurtturuusu') }}: </span>
                  {{
                    clean.kurtturuusu === 'yes'
                      ? $t('message.yes') + ': ' + clean.kurtturuusu_detail
                      : clean.kurtturuusu === 'no'
                      ? $t('message.no')
                      : $t('message.unsure') + ': ' + clean.kurtturuusu_detail
                  }}
                </p>
                <p>
                  <span class="bold">{{ $t('message.jattipalsami') }}: </span>
                  {{
                    clean.jattipalsami === 'yes'
                      ? $t('message.yes') + ': ' + clean.jattipalsami_detail
                      : clean.jattipalsami === 'no'
                      ? $t('message.no')
                      : $t('message.unsure') + ': ' + clean.jattipalsami_detail
                  }}
                </p>
              </div>

              <div class="clean-more">
                <p>{{ clean.cleanmoreinfo }}</p>
              </div>

              <div class="clean-cta">
                <button
                  class="small-button show-button"
                  :id="clean.selected.key"
                  @click="showcleaned"
                >
                  {{ $t('message.show_map') }}
                </button>
                <button
                  class="small-button del-button"
                  @click="openDeleteCleanConfirmation(clean)"
                >
                  {{ $t('message.delete_cleaned') }}
                </button>

                <div v-if="clean.confirmed">
                  <button
                    class="small-button confirm-button"
                    @click="cancelCleaned($event, clean)"
                    :id="clean.selected.key"
                  >
                    {{ $t('message.cancel_cleaned') }}
                  </button>
                </div>
                <div v-if="!clean.confirmed">
                  <button
                    class="small-button cancel-button"
                    @click="openConfirmCleanConfirmation(clean)"
                    :id="clean.selected.key"
                  >
                    {{ $t('message.confirm_cleaned') }}
                  </button>
                </div>
                <button
                  :disabled="!clean.confirmed"
                  class="small-button archive-button"
                  :id="clean.selected.key"
                  @click="openConfirmCleanArchival(clean)"
                >
                  {{ $t('message.archive_cleaned') }}
                </button>
              </div>
            </li>
          </div>
        </div>
      </div>

      <div class="refreshcontainer">
        <button class="small-button" @click="refresh">
          Päivitä tiedot
        </button>
      </div>

      <div
        class="confirmation-wrapper"
        v-if="showDeleteReservationConfirmation"
      >
        <div class="confirmation-container">
          {{ $t('message.reservation_deletion_confirmation_message') }}

          <button @click="showDeleteReservationConfirmation = false">
            {{ $t('message.cancel') }}
          </button>

          <button @click="deleteReservation(reservationToDelete)">
            {{ $t('message.yes') }}
          </button>
        </div>
      </div>

      <div class="confirmation-wrapper" v-if="showDeleteCleanConfirmation">
        <div class="confirmation-container">
          {{ $t('message.clean_deletion_confirmation_message') }}

          <button @click="showDeleteCleanConfirmation = false">
            {{ $t('message.cancel') }}
          </button>

          <button @click="deleteCleaned(cleanToDelete)">
            {{ $t('message.yes') }}
          </button>
        </div>
      </div>

      <div class="confirmation-wrapper" v-if="showCleanConfirmConfirmation">
        <div class="confirmation-container">
          {{ $t('message.clean_confirm_confirmation_message') }}

          <button @click="showCleanConfirmConfirmation = false">
            {{ $t('message.cancel') }}
          </button>

          <button @click="confirmCleaned(cleanToConfirm)">
            {{ $t('message.yes') }}
          </button>
        </div>
      </div>

      <div class="confirmation-wrapper" v-if="showCleanArchivalConfirmation">
        <div class="confirmation-container">
          {{ $t('message.clean_archival_confirmation_message') }}

          <button @click="showCleanArchivalConfirmation = false">
            {{ $t('message.cancel') }}
          </button>

          <button @click="archiveCleaned(cleanToArchive)">
            {{ $t('message.yes') }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loginview">
    <form class="form" v-on:submit.prevent="signin">
      <label for="username">{{ $t('message.username') }}</label>
      <input
        id="username"
        v-model="login.username"
        type="text"
        name=""
        value=""
      />
      <label for="password">{{ $t('message.password') }}</label>
      <input
        id="password"
        v-model="login.password"
        type="password"
        name=""
        value=""
      />
      <button type="submit" name="">{{ $t('message.login') }}</button>
    </form>
  </div>
</template>

<script>
import ShoreMap from '@/components/ShoreMap'
import AppFooter from '@/components/AppFooter'

import axios from 'axios'
export default {
  name: 'control',
  data() {
    return {
      //mapkey to remount component
      mapkey: 0,
      adminmode: true,
      reservations: {},
      selected: {},
      login_token: false,
      login: {
        username: '',
        password: ''
      },
      showunhide: false,
      cleaned: {},
      selectedShoreData: {},
      mapOverlayAction: null,
      showReservations: false,
      showCleanedShores: false,
      showOnMap: false,
      reservationToDelete: null,
      showDeleteReservationConfirmation: false,
      cleanToDelete: null,
      showDeleteCleanConfirmation: false,
      cleanToConfirm: null,
      showCleanConfirmConfirmation: false,
      cleanToArchive: null,
      showCleanArchivalConfirmation: false,
      counterSteps: null,
      counterKm: null,
      hideConfirmed: false,
      newestfirst: true,
      invasiveonly: false
    }
  },
  components: {
    ShoreMap
  },
  methods: {
    shouldShowClean(c) {
      if (!this.hideConfirmed && !this.invasiveonly) {
        return true
      }
      if (this.hideConfirmed && c.confirmed) {
        return false
      }
      if (this.hideConfirmed && !c.confirmed) {
        return true
      }
      if (this.invasiveonly) {
        if (c.kurtturuusu == 'yes' || c.jattipalsami == 'yes') {
          return true
        } else if (
          (c.kurtturuusu == 'idk' && c.kurtturuusu_detail) ||
          (c.jattipalsami == 'idk' && c.jattipalsami_detail)
        ) {
          return true
        } else {
          return false
        }
      }
    },
    refresh() {
      this.getReservations()
      this.getCleaned()
      this.getStepsKm()
      this.initMap()
      this.mapkey++
    },
    unSelect() {
      this.selectedShoreData = null
      this.mapOverlayAction = null
      this.$refs.adminmap.unHighlightAll()
    },
    signin() {
      axios
        .post(process.env.VUE_APP_URL + '/api/map/login/', {
          username: this.login.username,
          password: this.login.password
        })
        .then(response => {
          this.login_token = response.data.token
          axios.defaults.headers.common['authorization'] = this.login_token
          this.getReservations()
          this.getCleaned()
          this.getStepsKm()
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
      this.unSelect()
      this.selectedShoreData = data
      this.mapOverlayAction = 'hide'
      this.$refs.adminmap.highlight(data.key, 'freeShore')
    },
    populateSelectedHiddenShoreData(data) {
      this.unSelect()
      this.selectedShoreData = data
      this.mapOverlayAction = 'unhide'
      this.$refs.adminmap.highlight(data.key, 'hiddenShore')
    },
    scrollToClickedCleanShore(data) {
      this.unSelect()
      this.$refs.adminmap.highlight(data.key, 'cleanedShore')
      this.showReservations = false
      this.showCleanedShores = true
      const [cleanedShore] = this.$refs[`cleanedShore_${data.key}`]
      setTimeout(() => cleanedShore.classList.remove('scrollToAnimation'), 3000)
      cleanedShore.classList.add('scrollToAnimation')
      this.$nextTick(() => {
        cleanedShore.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      })
    },
    toggleReservationList() {
      this.showCleanedShores = false
      this.showReservations = !this.showReservations
    },
    toggleCleanedShoresList() {
      this.showReservations = false
      this.showCleanedShores = !this.showCleanedShores
    },
    openDeleteReservationConfirmation(reservation) {
      this.reservationToDelete = reservation
      this.showDeleteReservationConfirmation = true
    },
    openDeleteCleanConfirmation(clean) {
      this.cleanToDelete = clean
      this.showDeleteCleanConfirmation = true
    },
    openConfirmCleanConfirmation(clean) {
      this.cleanToConfirm = clean
      this.showCleanConfirmConfirmation = true
    },
    openConfirmCleanArchival(clean) {
      this.cleanToArchive = clean
      this.showCleanArchivalConfirmation = true
    },
    shoreHidden(data) {
      this.$refs.adminmap.unHighlightAll()
      this.selectedShoreData = null
      this.mapOverlayAction = null

      //filter the feature from free shores data
      this.$refs.adminmap.removeSegmentFromLayer(
        'freeShore',
        'freelayer',
        data._key
      )
      //add the feature to hidden shore data
      this.$refs.adminmap.addSegmentToLayer('hiddenShore', 'hiddenlayer', data)
    },
    shoreUnhidden(data) {
      this.$refs.adminmap.unHighlightAll()
      this.selectedShoreData = null
      this.mapOverlayAction = null

      this.$refs.adminmap.removeSegmentFromLayer(
        'hiddenShore',
        'hiddenlayer',
        data._key
      )
      this.$refs.adminmap.addSegmentToLayer('freeShore', 'freelayer', data)
    },
    confirmReservation(e, reservation) {
      const confirmReservation = reservation => {
        axios({
          method: 'POST',
          url: process.env.VUE_APP_URL + '/api/map/confirmreservation/',
          data: { key: reservation.selected.key, reservation: reservation._key }
        })
          .then(response => {
            if (response.data.status === 'ok') {
              reservation.confirmed = true
            }
          })
          .catch(function(error) {
            console.log(error)
          })
      }
      confirmReservation(reservation)
      if (reservation.multiples)
        reservation.multiples.forEach(reservation =>
          confirmReservation(reservation)
        )
    },
    shoreUnreserved(data) {
      if (data.status === 'cleaned') {
        return
      }
      this.$refs.adminmap.removeSegmentFromLayer(
        'reservedShore',
        'reservedlayer',
        data._key
      )
      this.$refs.adminmap.addSegmentToLayer('freeShore', 'freelayer', data)
    },
    shoreUncleaned(data) {
      this.$refs.adminmap.removeSegmentFromLayer(
        'cleanedShore',
        'cleanlayer',
        data._key
      )
      if (data.hasReservation) {
        this.$refs.adminmap.addSegmentToLayer(
          'reservedShore',
          'reservedlayer',
          data
        )
      } else {
        this.$refs.adminmap.addSegmentToLayer('freeShore', 'freelayer', data)
      }
    },
    cancelCleaned(e, cleaned) {
      axios
        .post(process.env.VUE_APP_URL + '/api/map/cancelcleanedbeach/', {
          key: e.target.id,
          clean: cleaned._key
        })
        .then(response => {
          if (response.data.status === 'ok') {
            cleaned.confirmed = false
            this.getStepsKm()
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    deleteReservation(reservation) {
      this.showDeleteReservationConfirmation = false
      const deleteReservation = reservation => {
        axios
          .delete(process.env.VUE_APP_URL + '/api/map/reservation', {
            data: {
              reservkey: reservation._key,
              shorekey: reservation.selected.key
            }
          })
          .then(res => {
            if (res.data.status === 'ok') {
              this.shoreUnreserved(res.data.json)
              this.reservations = this.reservations.filter(v => {
                return v !== reservation
              })
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
      deleteReservation(reservation)
      if (reservation.multiples)
        reservation.multiples.forEach(reservation =>
          deleteReservation(reservation)
        )
    },
    cancelReservation(e, reservation) {
      const cancelReservation = reservation => {
        axios
          .post(process.env.VUE_APP_URL + '/api/map/cancelreservation/', {
            key: reservation.selected.key,
            reservation: reservation._key
          })
          .then(response => {
            if (response.data.status === 'ok') {
              reservation.confirmed = false
            }
          })
          .catch(error => console.log(error))
      }
      cancelReservation(reservation)
      if (reservation.multiples)
        reservation.multiples.forEach(reservation =>
          cancelReservation(reservation)
        )
    },
    archiveCleaned(clean) {
      this.showCleanArchivalConfirmation = false
      axios
        .post(process.env.VUE_APP_URL + '/api/map/archive/', {
          key: clean._key
        })
        .then(response => {
          if (response.data.status === 'ok') {
            this.getCleaned()
            this.shoreUncleaned(response.data.shore)
          }
        })
        .catch(err => console.error(err))
    },
    confirmCleaned(clean) {
      this.showCleanConfirmConfirmation = false
      axios
        .post(process.env.VUE_APP_URL + '/api/map/clean/', {
          key: clean.selected.key,
          clean: clean._key
        })
        .then(response => {
          if (response.data.status === 'ok') {
            clean.confirmed = true
            clean.leader_name = '---'
            clean.leader_email = '---'
            clean.leader_phone = '---'
            this.getStepsKm()
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    deleteCleaned(clean) {
      this.showDeleteCleanConfirmation = false
      axios
        .delete(process.env.VUE_APP_URL + '/api/map/cleanedshore', {
          data: { cleankey: clean._key, shorekey: clean.selected.key }
        })
        .then(res => {
          if (res.data.status === 'ok') {
            this.shoreUncleaned(res.data.json)
            this.cleaned = this.cleaned.filter(v => {
              return v !== clean
            })
            this.getStepsKm()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    showreservation(ev) {
      this.$refs.adminmap.unHighlightAll()

      const reservation = this.reservations.find(
        reservation => reservation.selected.key === ev.target.id
      )
      let data = this.$store.state.maplayers['reservedlayer'].find(e => {
        return e._key === reservation.selected.key
      })
      const highlights = reservation.multiples
        ? [
            reservation.selected.key,
            ...reservation.multiples.map(res => res.selected.key)
          ]
        : [reservation.selected.key]
      if (data) {
        highlights.forEach(highlight =>
          this.$refs.adminmap.highlight(highlight, 'reservedShore')
        )
      } else {
        data = this.$store.state.maplayers['cleanlayer'].find(e => {
          return e._key === reservation.selected.key
        })
        highlights.forEach(highlight =>
          this.$refs.adminmap.highlight(highlight, 'cleanedShore')
        )
      }

      this.map.flyTo({
        center: [
          data.geometry.coordinates[0][0],
          data.geometry.coordinates[0][1]
        ],
        zoom: 17
      })
    },
    showcleaned(ev) {
      this.$refs.adminmap.unHighlightAll()
      this.$refs.adminmap.highlight(ev.target.id, 'cleanedShore')

      const data = this.$store.state.maplayers['cleanlayer'].find(e => {
        return e._key === ev.target.id
      })
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
        .get(process.env.VUE_APP_URL + '/api/map/reservations/')
        .then(res => {
          this.reservations = res.data.data.reduce((arr, reservation) => {
            const sameMultiID = arr.find(
              res => res.multiID === reservation.multiID
            )
            if (sameMultiID) {
              if (sameMultiID.multiples) sameMultiID.multiples.push(reservation)
              else sameMultiID.multiples = [reservation]
              return arr
            } else return [...arr, reservation]
          }, [])
          this.sortList(this.reservations, this.newestfirst)
        })
        .catch(error => {
          console.log(error)
        })
    },
    getCleaned() {
      axios
        .get(process.env.VUE_APP_URL + '/api/map/cleaninfos/')
        .then(reservation => {
          this.cleaned = reservation.data.data
          this.sortList(this.cleaned, this.newestfirst)
        })
        .catch(error => {
          console.log(error)
        })
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
    },
    gettoken() {
      axios
        .post(process.env.VUE_APP_URL + '/api/map/authcheck', {})
        .then(response => {
          if (response.data.success) {
            alert('success')
          }
        })
        .catch(error => {
          alert(error)
        })
    },
    removeOldReservations() {
      axios
        .delete(process.env.VUE_APP_URL + '/api/map/removeoldreservations')
        .then(res => {
          if (res.data.status === 'ok') {
            this.getReservations()
            for (let s of res.data.shores) {
              this.shoreUnreserved(s)
            }
            alert('Poistettiin ' + res.data.shores.length + ' vanhaa varausta.')
          }
        })
    },
    removeOldCleaninfos() {
      axios
        .delete(process.env.VUE_APP_URL + '/api/map/removeoldcleaninfos')
        .then(res => {
          if (res.data.status === 'ok') {
            this.getCleaned()
            for (let s of res.data.shores) {
              this.shoreUncleaned(s)
            }
            alert(
              'Poistettiin ' +
                res.data.shores.length +
                ' vanhentunutta siivousta.'
            )
          }
        })
    },
    sortList(array, newfirst) {
      array.sort((a, b) => {
        if (newfirst) {
          return a.timestamp < b.timestamp
            ? -1
            : a.timestamp > b.timestamp
            ? 1
            : 0
        } else {
          return a.timestamp > b.timestamp
            ? -1
            : a.timestamp < b.timestamp
            ? 1
            : 0
        }
      })
    },
    toggleSort() {
      console.log('toggle')
      this.newestfirst = !this.newestfirst
      this.sortList(this.reservations, this.newestfirst)
      this.sortList(this.cleaned, this.newestfirst)
    }
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

  h1 {
    font-weight: bold;
  }

  h2 {
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 10px;
  }

  h3 {
    font-size: 14px;
    font-weight: bold;
    text-decoration: underline;
    margin-bottom: 5px;
  }

  p {
    font-size: 14px;
    margin-top: 5px;
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
      word-break: break-word;

      .list-control {
        display: flex;
        background-color: white;
        height: 60px;
        width: 300px;
        padding: 10px 0;

        .hide-confirmed {
          padding: 15px 0;
          margin-left: 10px;
          width: 180px;
        }
      }

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
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          cursor: pointer;

          &-active {
            @extend .tab;
            border-bottom: none;
          }

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
          padding: 10px;
          margin: 10px 0;
          border-bottom: 2px solid #bbb;

          .reservation-time,
          .reservation-contact,
          .reservation-open {
            margin-bottom: 5px;
            padding-bottom: 5px;
            border-bottom: 1px dashed grey;
            padding-left: 10px;
          }

          .reservation-cta {
            display: flex;
          }
        }
      }

      .clean-infos {
        width: 350px;
        margin: 0 auto;

        .show-invasive {
          margin: 10px 0;
        }

        .clean-info {
          margin: 10px 0;
          padding: 10px;
          border-bottom: 2px solid #bbb;

          @keyframes scrollToAnimation {
            0% {
              box-shadow: 0 0 2px darken(#eee350, 17%);
            }
            20% {
              box-shadow: 0 0 4px darken(#eee350, 17%);
            }
            40% {
              box-shadow: 0 0 6px darken(#eee350, 17%);
            }
            60% {
              box-shadow: 0 0 8px darken(#eee350, 17%);
            }
            80% {
              box-shadow: 0 0 10px darken(#eee350, 17%);
            }
            100% {
              box-shadow: 0 0 12px darken(#eee350, 17%);
            }
          }
          &.scrollToAnimation {
            animation-name: scrollToAnimation;
            animation-duration: 500ms;
            animation-iteration-count: infinite;
            animation-direction: alternate;
          }

          .clean-time,
          .clean-contact,
          .clean-trash,
          .clean-plants {
            margin-bottom: 5px;
            padding-bottom: 5px;
            padding-left: 10px;
            border-bottom: 1px dashed grey;
          }

          .clean-more {
            padding-left: 10px;
            margin-bottom: 10px;
          }

          .clean-cta {
            margin-top: 10px;
            display: flex;

            .archive-button[disabled] {
              opacity: 38%;
            }
          }
        }
      }
    }

    .refreshcontainer {
      position: absolute;
      top: 100px;
      left: 350px;
      width: 150px;
      height: 50px;
      background-color: white;

      button {
        display: block;
        margin: 5px auto;
      }
    }
  }
}

.confirmed {
  background-color: #bbeebb;
}
.unconfirmed {
  background-color: #eebbbb;
}

.small-button {
  min-width: 50px;
  max-width: 120px;
  font-size: 12px;
  padding: 10px;
  word-break: normal;
}

.loginview {
  position: absolute;
  top: 30vh;
  width: 100%;

  .form {
    width: 250px;
    padding: 20px;
    margin: 0 auto;
    border: 5px dotted grey;

    input {
      padding: 15px;
      margin-bottom: 20px;
      display: block;
      border: none;
      background: #f1f1f1;
      width: 100%;
    }

    input:focus {
      background-color: #ddd;
      outline: none;
    }
  }
}

.confirmation-wrapper {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.8);
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9998;

  .confirmation-container {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 1rem;
    width: 400px;
    text-align: center;

    button {
      margin-top: 1rem;
    }
  }
}

.bold {
  font-weight: bold;
}
</style>
