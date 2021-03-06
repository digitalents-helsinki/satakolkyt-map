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
        @exit-hover="showInfoBox = false"
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
      <ReserveModal
        v-if="showReservationForm"
        v-bind:selected="selectedShoreData"
        @reservation-action="saveReservation"
        @close="showReservationForm = false"
        @show-privacy-info="showPrivacyInfo = true"
      />
      <CleanModal
        v-if="showCleaned"
        v-bind:selected="selectedShoreData"
        @close="showCleaned = false"
        @show-privacy-info="showPrivacyInfo = true"
        @cleaned-ok="shoreCleaned"
        @error-msg="setError"
      />
      <div v-if="showInfoBox" class="infoBoxWrapper">
        <InfoBox
          :data="infoBoxData"
          :type="selectedShoreType"
          :shores="selectedShoreData"
          @infobox-close="unSelect"
        />
      </div>
      <div class="trashtoggle-wrapper">
        <label for="trashcb"
          ><div class="trashtoggle">
            {{
              showTrashBins
                ? $t('message.hideTrashBins')
                : $t('message.showTrashBins')
            }}
            <img
              alt=""
              :src="showTrashBins ? 'hide_bins.svg' : 'show_bins.svg'"
              width="24px"
            /></div
        ></label>
        <input
          type="checkbox"
          id="trashcb"
          v-model="showTrashBins"
          @change="toggleTrashBins"
        />
      </div>
    </div>
    <div
      v-show="showPrivacyInfo"
      class="privacy-info-wrapper"
      @click="showPrivacyInfo = false"
    >
      <Policy />
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
import Policy from '@/components/Policy'
import axios from 'axios'
export default {
  name: 'home',

  data() {
    return {
      showCleaned: false,
      showReservationForm: false,

      // Selected Shore
      selectedShoreData: [],
      selectedShoreType: '',

      //Infobox
      showInfoBox: false,
      infoBoxData: null,

      showPrivacyInfo: false,

      showTrashBins: false,

      //Footer counter stuff
      counterSteps: null,
      counterKm: null,

      //Error stuff
      errMsg: '',
      showErrorInfo: false
    }
  },

  components: {
    ShoreMap,
    ReserveModal,
    CleanModal,
    AppFooter,
    InfoBox,
    Policy
  },

  methods: {
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
      if (this.reSelected(data)) {
        return
      }
      if (this.selectedShoreType === 'cleaned') {
        this.infoBoxData = null
        this.selectedShoreData = []
        this.selectedShoreType = null
      }
      this.$refs.usermap.highlight(data.key, 'reservedShore')
      this.selectedShoreData.push({ ...data, type: 'reserved' })
      if (this.selectedShoreData.length > 1) {
        this.selectedShoreType = 'multireserved'
        this.infoBoxData = null
      } else {
        this.selectedShoreType = 'reserved'
        this.getReservationInfo(data)
      }
      this.showInfoBox = true
    },
    getReservationInfo(data) {
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
      this.selectedShoreData = []
      if (
        this.selectedShoreData.length > 0 &&
        this.selectedShoreData[0].key === data.key
      ) {
        this.unSelect()
        return
      }
      this.infoBoxData = null
      this.$refs.usermap.highlight(data.key, 'cleanedShore')
      this.selectedShoreData.push(data)
      this.selectedShoreType = 'cleaned'
      this.showInfoBox = true
      this.getCleanInfo(data)
    },
    getCleanInfo(data) {
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
      if (this.reSelected(data)) {
        return
      }
      if (this.selectedShoreType === 'cleaned') {
        this.infoBoxData = null
        this.selectedShoreData = []
        this.selectedShoreType = null
      }
      this.$refs.usermap.highlight(data.key, 'freeShore')
      this.selectedShoreData.push({ ...data, type: 'free' })
      if (this.selectedShoreType !== 'multireserved') {
        if (this.selectedShoreType === 'reserved') {
          this.selectedShoreType = 'multireserved'
        } else if (this.selectedShoreData.length > 1) {
          this.selectedShoreType = 'multifree'
        } else {
          this.selectedShoreType = 'free'
        }
      }
      this.showInfoBox = true
    },
    reSelected(data) {
      const newarray = []
      let unselect = false
      for (let s of this.selectedShoreData) {
        if (s.key === data.key) {
          this.$refs.usermap.unHighlight(data.key)
          unselect = true
        } else {
          newarray.push(s)
        }
      }
      if (unselect) {
        if (newarray.length === 0) {
          this.unSelect()
          return true
        }
        if (newarray.length === 1) {
          this.selectedShoreType = newarray[0].type
          if (this.selectedShoreType == 'reserved') {
            this.getReservationInfo(newarray[0])
          }
        } else {
          let includesreserved = false
          for (let s of newarray) {
            if (s.type === 'reserved') {
              includesreserved = true
              break
            }
          }
          this.selectedShoreType = includesreserved
            ? 'multireserved'
            : 'multifree'
        }
        this.selectedShoreData = newarray
        return true
      }
      return false
    },
    unSelect() {
      this.showInfoBox = false
      this.infoBoxData = null
      this.selectedShoreData = []
      this.selectedShoreType = null
      this.$refs.usermap.unHighlightAll()
    },
    getStepsKm() {
      fetch(process.env.VUE_APP_URL + '/api/map/stepskm/')
        .then(res => res.json())
        .then(data => {
          this.counterKm = data.km
          this.counterSteps = data.steps
        })
        .catch(err => console.log(err))
    },
    toggleTrashBins(ev) {
      if (this.showTrashBins) {
        this.$refs.usermap.addTrashBins()
      } else {
        this.$refs.usermap.removeTrashBins()
      }
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
    bottom: 130px;
    z-index: 2;
  }

  .trashtoggle-wrapper {
    position: absolute;
    top: 100px;
    right: calc(5vw + 70px);

    label {
      position: absolute;
      top: 0;
      right: 0;
      width: 50px;
      font-weight: bold;
      font-size: 14px;
      text-transform: uppercase;
      font-size: 11px;

      .trashtoggle {
        display: flex;
        flex-flow: column wrap;
        align-items: center;
        box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
        padding: 7px 0 8px 0;
        background-color: #fff;
        border-radius: 5px;
      }
    }

    input {
      display: none;
    }
  }
}
</style>
