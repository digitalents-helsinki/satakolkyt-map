<template>
  <div class="modal-mask">
    <div class="modal-wrapper" @click="$emit('close')">
      <div class="modal-container" @click.stop>
        <template v-if="!saved">
          <font-awesome-icon
            icon="times"
            class="cross-icon"
            @click="$emit('close')"
          />
          <form v-on:submit.prevent="saveContactInfo">
            <div class="modal-header">
              <slot name="header">
                <h3>Varaa ranta siivoukseen</h3>
              </slot>
            </div>

            <div class="modal-body">
              <slot name="body">
                <p>Päivämäärä aloitukselle</p>
                <input v-model="data.startdate" type="date" />
                <p>Kellonaika aloitukselle</p>
                <vue-timepicker
                  v-model="data.starttime"
                  format="HH:mm"
                ></vue-timepicker>
                <p>Päivämäärä lopetukselle</p>
                <input v-model="data.enddate" type="date" />
                <p>Kellonaika lopetukselle</p>
                <vue-timepicker
                  v-model="data.endtime"
                  format="HH:mm"
                ></vue-timepicker>
                <p>Minkäläiset talkoot</p>
                <select v-model="data.type" class="" name="type">
                  <option value="open">Avoimet talkoot</option>
                  <option value="private">oman porukan talkoot </option>
                </select>
                <p>Järjestävän taho</p>
                <input v-model="data.organizer" type="text" />
                <p>Yhteyshenkilön</p>
                <p>Nimi</p>
                <input v-model="data.name" type="text" />
                <p>puhelinnumero</p>
                <input v-model="data.phonenumbery" type="text" />
                <p>sähköposti</p>
                <input v-model="data.email" type="text" />
              </slot>
            </div>

            <div class="modal-footer">
              <slot name="footer">
                <button class="modal-default-button" @click="showModal = false">
                  OK
                </button>
                <button class="modal-default-button" @click="$emit('close')">
                  Sulje
                </button>
              </slot>
            </div>
          </form>
        </template>
        <template v-if="saved">
          <div class="modal-header">
            <slot name="header">
              <h1 class="success">Varaus on tallennettu</h1>
              <button class="modal-default-button" @click="$emit('close')">
                Sulje
              </button>
            </slot>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import VueTimepicker from 'vue2-timepicker'
export default {
  components: { VueTimepicker },
  name: 'modal',
  props: ['selected'],

  data() {
    return {
      data: {
        saved: false,
        starttime: {
          hh: '',
          mm: ''
        },
        endtime: {
          hh: '',
          mm: ''
        }
      }
    }
  },
  mounted() {
    this.data.selected = this.$props.selected
  },
  methods: {
    saveContactInfo() {
      console.log(this.data)
      var reservation = JSON.parse(JSON.stringify(this.data))
      reservation.endtime = this.data.endtime.hh + ':' + this.data.endtime.mm
      reservation.starttime =
        this.data.starttime.hh + ':' + this.data.starttime.mm
      this.saved = true
      this.$emit('reservation-action', reservation)
    }
  }
}
</script>
<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.cross-icon {
  float: right;
}

.modal-container {
  width: 400px;
  height: 85vh;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
  overflow: scroll;
}
.modal-header h3 {
  font-weight: 700;
}

.modal-body {
  margin: 20px 0;
}
.modal-footer div {
  margin-bottom: 20px;
}
.modal-default-button {
  width: 100%;
  margin-bottom: 5px;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
input {
  padding: 12px 20px;
  margin: 8px 0;
  box-sizing: border-box;
  border: none;
  border-bottom: 2px solid green;
}
select {
  padding: 16px 20px;
  border: none;
  border-radius: 4px;
  background-color: #f1f1f1;
}
select,
input {
  width: 100%;
}
.success {
  color: green;
}
</style>
