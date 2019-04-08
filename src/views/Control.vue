<template>
  <div class="controlpanel-wrapper" @click="$emit('close')">
    <div class="controlpanel-container" @click.stop>
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
            <button>Näytä kartassa</button>
            <button class="green">Vahvista varaus</button>
          </div>
        </li>
      </div>
      <div class="editor">
        Edit Map
        <admin-map-box v-bind:data="json" v-bind:data2="json2" />
      </div>
    </div>
  </div>
</template>

<script>
import AdminMapBox from '@/components/AdminMapBox'

export default {
  name: 'control',
  data() {
    return {
      reservations: {},
      json: {},
      json2: {}
    }
  },
  components: {
    AdminMapBox
  },
  methods: {
    initMap() {
      fetch('http://localhost:8089/api/map/shores')
        .then(response => {
          return response.json()
        })
        .then(shores => {
          this.json = shores.data
        })
        .catch(error => {
          console.log(error)
        })
      fetch('http://localhost:8089/api/map/shores/reserved')
        .then(response => {
          return response.json()
        })
        .then(shores => {
          this.json2 = shores.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    getReservations() {
      fetch('http://localhost:8089/api/map/reservations/')
        .then(response => {
          return response.json()
        })
        .then(reservation => {
          this.reservations = reservation.data
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  mounted() {
    this.getReservations()
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
    background: green;
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
}
</style>
