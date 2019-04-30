<template>
  <div class="modal-mask">
    <div class="modal-wrapper" @click="$emit('close')">
      <div
        class="modal-container"
        v-bind:class="{ morespace: reservationdata.free }"
        @click.stop
      >
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
                <div class="flex-grid">
                  <div class="col">
                    <h3>Lorem ipsum dolor sit am</h3>
                  </div>
                  <div class="col">
                    <input :required="required ? true : false" type="text" />
                  </div>
                </div>
                {{ $t('message.date') }}
                <div class="reservationform">
                  <div class="item">
                    <font-awesome-icon icon="calendar" />

                    <input
                      :required="required ? true : false"
                      v-model="reservationdata.startdate"
                      type="date"
                    />
                  </div>
                  <div class="item">
                    <font-awesome-icon icon="clock" />

                    <vue-timepicker
                      class="timepicker"
                      :required="required ? true : false"
                      v-model="reservationdata.starttime"
                      format="HH:mm"
                    ></vue-timepicker>
                  </div>
                  <div class="item">
                    <font-awesome-icon icon="calendar" />

                    <input
                      :required="required ? true : false"
                      v-model="reservationdata.enddate"
                      type="date"
                    />
                  </div>
                  <div class="item">
                    <font-awesome-icon icon="clock" />

                    <vue-timepicker
                      class="timepicker"
                      :required="required ? true : false"
                      v-model="reservationdata.endtime"
                      format="HH:mm"
                    ></vue-timepicker>
                  </div>
                </div>
                <div class="flex-grid">
                  <div class="col">
                    <h1>{{ $t('message.type_open') }}</h1>
                  </div>
                  <div class="col">
                    <input
                      v-model="reservationdata.free"
                      type="checkbox"
                      checked="checked"
                    />
                  </div>
                </div>
                <template v-if="reservationdata.free">
                  Lorem ipsum dolor sit amet,
                  <input type="text" name="" value="" />
                  <div class="flex-grid">
                    <div class="col">
                      Lorem ipsum dolor sit amet,
                    </div>
                    <div class="col">
                      <input type="text" name="" value="" />
                    </div>
                  </div>
                </template>

                <h1>{{ $t('message.organizer') }}</h1>

                <p>{{ $t('message.contact') }}</p>
                <div class="flex-grid">
                  <div class="col">
                    <p>{{ $t('message.name') }}</p>
                  </div>
                  <div class="col">
                    <input
                      :required="required ? true : false"
                      v-model="reservationdata.name"
                      type="text"
                    />
                  </div>
                </div>
                <div class="flex-grid">
                  <div class="col">
                    <p>{{ $t('message.email') }}</p>
                  </div>
                  <div class="col">
                    <input
                      :required="required ? true : false"
                      v-model="reservationdata.email"
                      type="email"
                    />
                  </div>
                </div>
                <div class="flex-grid">
                  <div class="col">
                    <p>{{ $t('message.phonenumber') }}</p>
                  </div>
                  <div class="col">
                    <input
                      :required="required ? true : false"
                      v-model="reservationdata.phonenumber"
                      pattern="[0-9]{3,11}"
                      type="tel"
                    />
                  </div>
                </div>
              </slot>
            </div>

            <div class="modal-footer">
              <slot name="footer">
                <button
                  class="modal-default-button blue"
                  @click="showModal = false"
                >
                  Ok
                </button>
                <button
                  class="modal-default-button grey"
                  @click="$emit('close')"
                >
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
      free: false,
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
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.cross-icon {
  float: right;
}

.modal-container {
  width: 700px;
  height: 60vh;
  margin-left: 5%;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
}
.morespace {
  height: 80vh;
}
@media only screen and (max-width: 600px) {
  .modal-container {
    width: 95%;
  }
}
.modal-header h3 {
  font-weight: 700;
}
.date-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  flex-direction: row;
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
  float: right;
  color: white;
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
  border: 2px solid #e5e5e5;
}
select {
  padding: 16px 20px;
  border: none;
  border-radius: 4px;
  background-color: #f1f1f1;
}
h1 {
  font-weight: bold;
}
select,
input {
  width: 100%;
}
.success {
  color: green;
}
.grey {
  background: #c4c4c4;
}
input:invalid,
select {
  border-color: red;
  box-shadow: none;
}
.flex-grid {
  display: flex;
}
.col {
  flex: 1;
}
.blue {
  background: #51bdff;
}
.reservationform {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
}
.item {
  display: flex;
  align-items: center;
}
</style>
