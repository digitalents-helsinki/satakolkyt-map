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
          <form v-on:submit.prevent="saveReservation">
            <div class="modal-header">
              <slot name="header">
                <h3>{{ $t('message.reserve_clean') }}</h3>
                <p>
                  {{ $t('message.reserve_sub') }}
                </p>
                <div v-bind:key="error.param" class="" v-for="error in errors">
                  {{ error.param }} {{ error.msg }}
                </div>
              </slot>
            </div>

            <div class="modal-body">
              <slot name="body">
                <div class="input-field">
                  <h5>{{ $t('message.organizer') }}</h5>
                  <input
                    :required="required"
                    type="text"
                    v-model="reservationdata.organizer"
                  />
                </div>

                <div class="datetime">
                  <h5>{{ $t('message.date') }}</h5>

                  <div class="datetime-inputs">
                    <div class="datetime-item">
                      <font-awesome-icon icon="calendar" />

                      <input
                        :required="required"
                        v-model="reservationdata.startdate"
                        type="date"
                        @change="checkDateValidity"
                      />
                    </div>
                    <div class="datetime-item">
                      <font-awesome-icon icon="clock" />

                      <vue-timepicker
                        class="timepicker"
                        :required="required"
                        :format="timeformat"
                        v-model="reservationdata.starttime"
                        :minute-interval="30"
                        hide-clear-button
                        @change="checkDateValidity"
                      />
                    </div>
                    <span>-</span>
                    <div class="datetime-item">
                      <font-awesome-icon icon="calendar" />

                      <input
                        :required="required"
                        v-model="reservationdata.enddate"
                        type="date"
                        @change="checkDateValidity"
                      />
                    </div>
                    <div class="datetime-item">
                      <font-awesome-icon icon="clock" />

                      <vue-timepicker
                        class="timepicker"
                        :required="required"
                        :format="timeformat"
                        v-model="reservationdata.endtime"
                        :minute-interval="30"
                        hide-clear-button
                        @change="checkDateValidity"
                      />
                    </div>
                  </div>
                  <div class="date-error">{{ dateerrormsg }}</div>
                </div>

                <div class="open-cleanup">
                  <div class="open-cleanup-check">
                    <h5>{{ $t('message.type_open') }}</h5>
                    <input
                      v-model="reservationdata.openevent"
                      type="checkbox"
                    />
                  </div>
                  <p>
                    {{ $t('message.openevent_explanation') }}
                  </p>
                  <div
                    class="open-cleanup-info"
                    :class="{
                      opencleanupexpand: reservationdata.openevent,
                      opencleanupshrink: !reservationdata.openevent
                    }"
                  >
                    <div class="open-cleanup-text">
                      <h5>{{ $t('message.openevent_text') }}</h5>
                      <textarea rows="3" v-model="reservationdata.openinfo" />
                    </div>
                    <div class="input-field">
                      <h5>{{ $t('message.openevent_link') }}</h5>
                      <input
                        type="text"
                        name=""
                        value=""
                        v-model="reservationdata.openlink"
                      />
                    </div>
                  </div>
                </div>

                <div class="contact-person">
                  <h4>{{ $t('message.contact') }}</h4>
                  <p>
                    {{ $t('message.contact_explanation') }}
                  </p>
                  <div class="input-field">
                    <h5>{{ $t('message.name') }}</h5>
                    <input
                      :required="required"
                      v-model="reservationdata.name"
                      type="text"
                    />
                  </div>
                  <div class="input-field">
                    <h5>{{ $t('message.email') }}</h5>
                    <input
                      :required="required"
                      v-model="reservationdata.email"
                      type="email"
                    />
                  </div>
                  <div class="input-field">
                    <h5>{{ $t('message.phonenumber') }}</h5>
                    <input
                      :required="required"
                      v-model="reservationdata.phonenumber"
                      pattern="[0-9]{3,11}"
                      type="tel"
                    />
                  </div>
                </div>
                <div class="permission-container">
                  <span
                    class="privacy-policy-button"
                    @click="$emit('show-privacy-info')"
                    ><h4>{{ $t('message.privacy_policy') }}</h4></span
                  >
                  <h4>{{ $t('message.submit_permission_text') }}</h4>
                  <input
                    type="checkbox"
                    v-model="privacy_permission"
                    required
                  />
                </div>
              </slot>
            </div>

            <div class="modal-footer">
              <slot name="footer">
                <button
                  class="modal-default-button grey"
                  @click.prevent="$emit('close')"
                >
                  {{ $t('message.close') }}
                </button>
                <button
                  class="modal-default-button blue"
                  @click="showModal = false"
                >
                  Ok
                </button>
              </slot>
            </div>
          </form>
        </template>
        <template v-if="saved">
          <div class="modal-header">
            <slot name="header">
              <div class="reservation-saved">
                <h1 class="success">{{ $t('message.reservation_saved') }}</h1>
                <button class="modal-default-button" @click="$emit('close')">
                  {{ $t('message.close') }}
                </button>
              </div>
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
  name: 'reserve-modal',
  props: ['selected'],

  data() {
    return {
      saved: false,
      required: true,
      errors: [],
      timeformat: 'HH:mm',
      dateerrormsg: '',
      reservationdata: {
        confirmed: false,
        organizer: '',
        startdate: '',
        starttime: {
          HH: '',
          mm: ''
        },
        enddate: '',
        endtime: {
          HH: '',
          mm: ''
        },
        openevent: false,
        openinfo: '',
        openlink: '',
        name: '',
        email: '',
        phonenumber: ''
      }
    }
  },
  mounted() {
    this.reservationdata.selected = this.$props.selected
  },
  methods: {
    saveReservation() {
      if (!this.checkDateValidity()) {
        return
      }
      var reservation = JSON.parse(JSON.stringify(this.reservationdata))
      reservation.endtime =
        this.reservationdata.endtime.HH + ':' + this.reservationdata.endtime.mm
      reservation.starttime =
        this.reservationdata.starttime.HH +
        ':' +
        this.reservationdata.starttime.mm
      this.$emit('reservation-action', {
        data: reservation,
        okCB: this.reservationOk
      })
    },
    reservationOk() {
      this.saved = true
    },
    checkDateValidity() {
      const sd = this.reservationdata.startdate.split('-')
      const start = new Date(
        parseInt(sd[0]),
        parseInt(sd[1]) - 1,
        parseInt(sd[2]),
        parseInt(this.reservationdata.starttime.HH),
        parseInt(this.reservationdata.starttime.mm),
        0,
        0
      )

      const now = new Date()
      console.log('now: ', now, 'start: ', start)
      if (start < now) {
        this.dateerrormsg = this.$t('message.start_in_future')
        return false
      } else {
        this.dateerrormsg = ''
      }

      const ed = this.reservationdata.enddate.split('-')
      const end = new Date(
        parseInt(ed[0]),
        parseInt(ed[1]) - 1,
        parseInt(ed[2]),
        parseInt(this.reservationdata.endtime.HH),
        parseInt(this.reservationdata.endtime.mm),
        0,
        0
      )
      if (start < end) {
        this.dateerrormsg = ''
        return true
      } else {
        this.dateerrormsg = this.$t('message.start_before_end')
        return false
      }
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
  width: 600px;
  height: 80vh;
  margin-left: 5%;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  overflow-y: auto;
}
@media only screen and (max-width: 600px) {
  .modal-container {
    width: 95%;
  }
}

form {
  position: relative;
  height: 100%;
}

.modal-header {
  margin-bottom: 2rem;
}

.modal-header h3 {
  font-weight: 800;
  font-size: 24px;
  margin-bottom: 0.5rem;
}

.modal-header p,
.modal-body p {
  font-size: 12px;
  color: #555;
}

.modal-body {
  margin: 20px 0;
}

.modal-header h3 {
  font-weight: 700;
}

.datetime {
  margin: 2rem 0;
}

.datetime h5 {
  margin-bottom: 0.5rem;
}

.datetime-inputs {
  display: flex;
  align-items: center;
}

.datetime-inputs span {
  margin: 0 3px;
}

.date-error {
  margin-top: 5px;
  font-size: 14px;
  color: red;
}

.open-cleanup {
  margin: 2rem 0;
}

.open-cleanup-check {
  display: flex;
  margin-bottom: 0.5rem;
}

.open-cleanup-check input {
  width: 10%;
}

.open-cleanup-info {
  margin: 1rem 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.opencleanupexpand {
  max-height: 150px;
}

.opencleanupshrink {
  max-height: 0;
}

.open-cleanup-text {
  margin-bottom: 0.7rem;
}

.open-cleanup-text h5 {
  margin-bottom: 0.5rem;
}

.contact-person {
  margin-top: 3rem;
}

.contact-person h4 {
  margin-bottom: 0.5rem;
}

.contact-person p {
  margin-bottom: 1.5rem;
}

.permission-container {
  margin: 40px 0;
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  justify-content: space-between;
}

.privacy-policy-button {
  color: darkblue;
  cursor: pointer;
}

.privacy-policy-button:hover {
  text-decoration: underline;
  color: #00d;
}

.permission-container input {
  width: 15px;
}

.modal-footer {
  width: 100%;
  margin: 10px 0 30px 0;
  display: flex;
  justify-content: flex-end;
}

.reservation-saved {
  margin-top: 50%;
}

.reservation-saved button {
  display: block;
  margin: 0 auto;
}

.modal-default-button {
  color: black;
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
  padding: 5px;
  box-sizing: border-box;
  border: 1px solid #555;
}
input[type='date'] {
  max-width: 135px;
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
h4 {
  font-weight: 600;
  font-size: 18px;
}
h5 {
  font-weight: 600;
  font-size: 16px;
}
select,
input {
  width: 100%;
  border: 1px solid #bbb;
}
.success {
  color: green;
  font-size: 24px;
  text-align: center;
  margin: 20px 0;
}
.grey {
  background: #c4c4c4;
}
input:invalid,
select {
  border-color: red;
  box-shadow: none;
}
.timepicker {
  max-width: max-content;
}
.input-field {
  display: flex;
  align-items: center;
  margin: 1rem 0;
}
.input-field h5 {
  margin-right: 20px;
  width: 60%;
}
textarea {
  border: 1px solid #bbb;
  resize: none;
  width: 100%;
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
.datetime-item {
  display: flex;
  align-items: center;
}
.datetime-item > * {
  margin: 0 3px;
}
</style>
