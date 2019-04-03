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
        </li>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'control',
  data() {
    return {
      reservations: {}
    }
  },
  methods: {
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
  }
}
</script>

<style lang="scss" scoped>
.controlpanel-container {
  width: 100%;
  height: 100%;
  background-color: white;
  display: flex;
  flex-flow: column wrap;

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
