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
                <h3>{{ $t('message.reserve_clean') }}</h3>
                <div v-bind:key="error.param" class="" v-for="error in errors">
                  {{ error.param }} {{ error.msg }}
                </div>
              </slot>
            </div>

            <div class="modal-body">
              <slot name="body">
                <p>{{ $t('message.date_start') }}</p>
                <input
                  :required="required ? true : false"
                  v-model="reservationdata.startdate"
                  type="date"
                />
                <p>{{ $t('message.time_start') }}</p>
                <vue-timepicker
                  :required="required ? true : false"
                  v-model="reservationdata.starttime"
                  format="HH:mm"
                ></vue-timepicker>
                <p>{{ $t('message.date_end') }}</p>
                <input
                  :required="required ? true : false"
                  v-model="reservationdata.enddate"
                  type="date"
                />
                <p>{{ $t('message.time_end') }}</p>
                <vue-timepicker
                  :required="required ? true : false"
                  v-model="reservationdata.endtime"
                  format="HH:mm"
                ></vue-timepicker>
                <p>{{ $t('message.type_label') }}</p>
                <select
                  :required="required ? true : false"
                  v-model="reservationdata.type"
                  class=""
                  name="type"
                >
                  <option :required="required ? true : false" value="open">{{
                    $t('message.type_open')
                  }}</option>
                  <option :required="required ? true : false" value="private"
                    >{{ $t('message.type_private') }}
                  </option>
                </select>
                <p>{{ $t('message.organizer') }}</p>
                <input
                  :required="required ? true : false"
                  v-model="reservationdata.organizer"
                  type="text"
                />
                <p>{{ $t('message.contact') }}</p>
                <p>{{ $t('message.name') }}</p>
                <input
                  :required="required ? true : false"
                  v-model="reservationdata.name"
                  type="text"
                />
                <p>{{ $t('message.phonenumber') }}</p>
                <input
                  :required="required ? true : false"
                  v-model="reservationdata.phonenumber"
                  pattern="[0-9]{3,11}"
                  type="tel"
                />
                <p>{{ $t('message.email') }}</p>
                <input
                  :required="required ? true : false"
                  v-model="reservationdata.email"
                  type="email"
                />
              </slot>
            </div>

            <div class="modal-footer">
              <slot name="footer">
                <button class="modal-default-button" @click="showModal = false">
                  Ok
                </button>
                <button class="modal-default-button" @click="$emit('close')">
                  {{ $t('message.close') }}
                </button>
              </slot>
            </div>
          </form>
        </template>
        <template v-if="saved">
          <div class="modal-header">
            <slot name="header">
              <h1 class="success">{{ $t('message.reservation_saved') }}</h1>
              <button class="modal-default-button" @click="$emit('close')">
                {{ $t('message.close') }}
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
      saved: false,
      required: false,
      errors: [],
      reservationdata: {
        confirm: false,
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
    this.reservationdata.selected = this.$props.selected
  },
  methods: {
    saveContactInfo() {
      var reservation = JSON.parse(JSON.stringify(this.reservationdata))
      reservation.endtime =
        this.reservationdata.endtime.hh + ':' + this.reservationdata.endtime.mm
      reservation.starttime =
        this.reservationdata.starttime.hh +
        ':' +
        this.reservationdata.starttime.mm
      this.$emit('reservation-action', {
        data: reservation,
        okCB: this.reservationOk,
        errCB: this.reservationError
      })
    },
    reservationOk() {
      this.saved = true
    },
    reservationError(data) {
      console.log(data)
      this.errors = data.errors
      alert('something went wrong: your reservation was rejected')
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
  margin-left: 5%;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
  overflow: scroll;
}
@media only screen and (max-width: 600px) {
  .modal-container {
    width: 95%;
  }
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
  width: 20%;
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

input:invalid,
select {
  border-color: red;
  box-shadow: none;
}
</style>
