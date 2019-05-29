// Copyright (C) 2019 Digitalents Helsinki

<template>
  <div class="modal-mask">
    <div class="modal-wrapper" @click="$emit('close')">
      <div
        class="modal-container"
        v-bind:class="{ morespace: reservationdata.free }"
        @click.stop
      >
        <div class="closer">
          <font-awesome-icon
            icon="times"
            class="cross-icon"
            @click="$emit('close')"
          />
        </div>
        <div v-if="!saved && !loading">
          <div class="modal-page" v-show="pagenum === 0">
            <form v-on:submit.prevent="saveReservation">
              <div class="modal-header">
                <h3>{{ $t('message.reserve') }}</h3>
                <p>
                  {{ $t('message.reserve_sub') }}
                </p>
              </div>

              <div class="modal-body">
                <div class="input-field">
                  <h4>{{ $t('message.organizer') }}</h4>
                  <input
                    :required="required"
                    type="text"
                    v-model="reservationdata.organizer"
                    maxlength="40"
                  />
                </div>

                <div class="datetime">
                  <h4>{{ $t('message.date') }}</h4>

                  <div class="datetime-inputs">
                    <div class="datetime-date">
                      <font-awesome-icon icon="calendar" />
                      <datepicker
                        :required="required"
                        :language="
                          $i18n.locale === 'fi'
                            ? fi
                            : $i18n.locale === 'en'
                            ? en
                            : sv
                        "
                        :monday-first="true"
                        v-model="reservationdata.startdate"
                      />
                    </div>
                    <div class="datetime-timeinputs">
                      <div class="datetime-time">
                        <font-awesome-icon icon="clock" />

                        <vue-timepicker
                          class="timepicker"
                          :required="required"
                          :format="timeformat"
                          v-model="reservationdata.starttime"
                          :minute-interval="30"
                          hide-clear-button
                        />
                      </div>
                      <div>-</div>
                      <div class="datetime-time">
                        <font-awesome-icon icon="clock" />

                        <vue-timepicker
                          class="timepicker"
                          :required="required"
                          :format="timeformat"
                          v-model="reservationdata.endtime"
                          :minute-interval="30"
                          hide-clear-button
                        />
                      </div>
                    </div>
                  </div>
                  <div class="date-error">{{ dateerrormsg }}</div>
                </div>

                <div class="open-cleanup">
                  <div class="open-cleanup-check">
                    <div class="open-cleanup-radio">
                      <label for="open_event_yes">{{
                        $t('message.type_open')
                      }}</label>
                      <div>
                        <input
                          :value="true"
                          v-model="reservationdata.openevent"
                          type="radio"
                          id="open_event_yes"
                        />
                      </div>
                    </div>
                    <div class="open-cleanup-radio">
                      <label for="open_event_no">{{
                        $t('message.type_private')
                      }}</label>
                      <div>
                        <input
                          :value="false"
                          v-model="reservationdata.openevent"
                          type="radio"
                          id="open_event_no"
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    class="open-cleanup-info"
                    :class="{
                      opencleanupexpand: reservationdata.openevent,
                      opencleanupshrink: !reservationdata.openevent
                    }"
                  >
                    <div class="open-cleanup-text">
                      <h5>{{ $t('message.openevent_text') }}</h5>
                      <textarea
                        rows="3"
                        v-model="reservationdata.openinfo"
                        maxlength="200"
                      />
                    </div>
                    <div class="input-field">
                      <h5>{{ $t('message.openevent_link') }}</h5>
                      <input
                        type="text"
                        name=""
                        value=""
                        v-model="reservationdata.openlink"
                        maxlength="100"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div class="modal-footer">
                <button
                  class="modal-default-button blue"
                  @click.prevent="toNextPage"
                >
                  {{ $t('message.next') }}
                </button>
              </div>
            </form>
          </div>
          <div class="modal-page" v-show="pagenum === 1">
            <form>
              <div class="modal-header">
                <h3>{{ $t('message.reserve') }}</h3>
                <p>
                  {{ $t('message.reserve_sub') }}
                </p>
              </div>
              <div class="modal-body">
                <div class="contact-person">
                  <h4>{{ $t('message.contact') }}</h4>
                  <div class="input-field">
                    <h5>{{ $t('message.name') }}</h5>
                    <input
                      :required="required"
                      v-model="reservationdata.name"
                      type="text"
                      maxlength="40"
                    />
                  </div>
                  <div class="input-field">
                    <h5>{{ $t('message.email') }}</h5>
                    <input
                      :required="required"
                      v-model="reservationdata.email"
                      type="email"
                      maxlength="40"
                    />
                  </div>
                  <div class="input-field">
                    <h5>{{ $t('message.phonenumber') }}</h5>
                    <input
                      :required="required"
                      v-model="reservationdata.phonenumber"
                      pattern="[0-9]{3,11}"
                      type="tel"
                      maxlength="12"
                    />
                  </div>
                </div>
                <div class="permission-container">
                  <span
                    class="privacy-policy-button"
                    @click="$emit('show-privacy-info')"
                    ><h4>{{ $t('message.privacy_policy') }}</h4></span
                  >
                  <div class="permission-input-container">
                    <label for="reserve-permission">{{
                      $t('message.submit_permission_text')
                    }}</label>
                    <span>
                      <input
                        id="reserve-permission"
                        type="checkbox"
                        v-model="privacy_permission"
                        required
                      />
                    </span>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button
                  class="modal-default-button blue"
                  @click.prevent="toPrevPage"
                >
                  {{ $t('message.previous') }}
                </button>
                <button
                  class="modal-default-button blue"
                  @click.prevent="saveReservation"
                >
                  {{ $t('message.send') }}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div v-if="!saved && loading">
          <div class="spinner-container">
            <spinner />
          </div>
        </div>
        <div v-if="saved && !loading">
          <div class="modal-header">
            <div class="reservation-saved">
              <img src="kalatunnus.png" alt="" />
              <h1 class="success">{{ $t('message.reservation_saved') }}</h1>
              <button class="modal-default-button" @click="$emit('close')">
                {{ $t('message.close') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import VueTimepicker from 'vue2-timepicker'
import Datepicker from 'vuejs-datepicker'
import Spinner from '@/components/Spinner'
import { fi, en, sv } from 'vuejs-datepicker/dist/locale'
export default {
  components: { VueTimepicker, Datepicker, Spinner },
  name: 'reserve-modal',
  props: ['selected'],

  data() {
    return {
      pagenum: 0,
      saved: false,
      loading: false,
      required: true,
      errors: [],
      timeformat: 'HH:mm',
      dateerrormsg: '',
      fi: fi,
      en: en,
      sv: sv,
      reservationdata: {
        confirmed: false,
        organizer: '',
        startdate: '',
        starttime: {
          HH: '00',
          mm: '00'
        },
        endtime: {
          HH: '00',
          mm: '00'
        },
        openevent: false,
        openinfo: '',
        openlink: '',
        name: '',
        email: '',
        phonenumber: ''
      },
      privacy_permission: false
    }
  },
  mounted() {
    this.reservationdata.selected = this.$props.selected
  },
  methods: {
    toNextPage(e) {
      if (e.target.form.reportValidity()) {
        if (this.pagenum == 0 && !this.checkDateValidity()) {
          return
        }
        this.pagenum++
      }
    },
    toPrevPage() {
      this.pagenum--
    },
    saveReservation(e) {
      if (e.target.form.reportValidity()) {
        if (!this.checkDateValidity()) {
          return
        }
        this.loading = true
        this.reservationdata.startdate = this.reservationdata.startdate
          .toISOString()
          .substring(0, 10)
        var reservation = JSON.parse(JSON.stringify(this.reservationdata))
        reservation.endtime =
          this.reservationdata.endtime.HH +
          ':' +
          this.reservationdata.endtime.mm
        reservation.starttime =
          this.reservationdata.starttime.HH +
          ':' +
          this.reservationdata.starttime.mm
        this.$emit('reservation-action', {
          data: reservation,
          okCB: this.reservationOk
        })
      }
    },
    reservationOk() {
      this.loading = false
      this.saved = true
    },
    checkDateValidity() {
      const tempDate = this.reservationdata.startdate
        .toISOString()
        .substring(0, 10)
      const sd = tempDate.split('-')
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
      if (start < now) {
        this.dateerrormsg = this.$t('message.start_in_future')
        return false
      } else {
        this.dateerrormsg = ''
      }

      //const ed = this.reservationdata.enddate.split('-')
      const end = new Date(
        parseInt(sd[0]),
        parseInt(sd[1]) - 1,
        parseInt(sd[2]),
        parseInt(this.reservationdata.endtime.HH),
        parseInt(this.reservationdata.endtime.mm),
        0,
        0
      )
      console.log('start: ' + start)
      console.log('end: ' + end)
      console.log(start < end)

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

.modal-container {
  position: relative;
  width: 550px;
  height: 80vh;
  margin-left: 5%;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  overflow-y: auto;
  line-height: 1.2;
}

.closer {
  position: absolute;
  font-size: 30px;
  cursor: pointer;
  right: 10px;
  top: 0;
  padding: 20px;
  z-index: 99999;
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

.modal-body h4 {
  min-width: 120px;
}

.modal-header h3 {
  font-weight: 700;
}

.datetime {
  margin: 2rem 0;
}

.datetime h4 {
  margin-bottom: 0.5rem;
}

.datetime-inputs {
  display: flex;
}

.datetime-date {
  position: relative;
}

.datetime-date svg {
  position: absolute;
  top: 6px;
  left: 8px;
  z-index: 101;
}

.datetime-date input {
  margin-left: 3px;
}

.datetime-timeinputs {
  margin-left: 10px;
  display: flex;
  align-items: center;
}

.datetime-time {
  display: flex;
  align-items: center;
}

.datetime-time span {
  margin-left: 3px;
}

.datetime-timeinputs > * {
  margin: 0 5px;
}

.date-error {
  margin-top: 5px;
  font-size: 14px;
  color: #f82828;
}

.open-cleanup {
  margin: 2rem 0;
}

.open-cleanup-check {
  display: flex;
  margin-bottom: 0.5rem;
}

.open-cleanup-radio {
  display: flex;
  margin-right: 30px;
}

.open-cleanup-radio label {
  margin-right: 10px;
}

.open-cleanup-radio div {
  display: flex;
  align-content: center;
}

.open-cleanup-radio div input {
  width: 15px;
}

.open-cleanup-info {
  margin: 1rem 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.opencleanupexpand {
  max-height: 200px;
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
  justify-content: space-around;
  align-items: center;
}

.privacy-policy-button {
  max-width: 180px;
  background-color: #fda218;
  display: flex;
  align-items: center;
  padding: 10px 15px;
  margin-right: 10px;
}

.privacy-policy-button h4 {
  text-decoration: underline;
  font-size: 16px;
  color: black;
  cursor: pointer;
}

.privacy-policy-button:hover {
  text-decoration: underline;
  color: #00d;
}

.permission-input-container {
  font-weight: bold;
  font-size: 14px;
  display: flex;
  align-items: center;
  max-width: 250px;
}

.permission-input-container span {
  min-width: 20px;
  margin-left: 10px;
}

.permission-input-container span input {
  transform: scale(1.5);
}

.modal-footer {
  width: 100%;
  margin: 10px 0 30px 0;
  display: flex;
  justify-content: flex-end;
}

.reservation-saved img {
  max-width: 300px;
  display: block;
  margin: 50px auto 30px auto;
}

.reservation-saved button {
  display: block;
  margin: 0 auto;
}

.modal-default-button {
  color: black;
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
  color: #006b32;
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
.spinner-container {
  width: 100%;
  height: 95%;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media only screen and (max-width: 600px) {
  .modal-container {
    margin-left: 5px;
    height: 96vh;
    width: 350px;
  }

  .modal-header h3 {
    max-width: 250px;
  }

  .closer {
    right: 0;
    top: -10px;
  }

  .open-cleanup-radio label {
    flex: 0.8;
  }

  .contact-person {
    margin-top: 30px;
  }

  .input-field {
    flex-direction: column;
  }

  .input-field h4 {
    width: 100%;
    margin-bottom: 5px;
  }

  .input-field h5 {
    width: 100%;
    margin: 0 0 5px 0;
  }

  .datetime-inputs {
    flex-direction: column;
  }

  .datetime-date {
    margin: 0 0 10px 5px;
  }

  .datetime-timeinputs {
    margin: 0;
  }

  .permission-container {
    flex-direction: column;
    margin: 30px 0;
  }

  .privacy-policy-button {
    margin-bottom: 20px;
  }

  .modal-footer button {
    min-width: 0;
    width: 150px;
  }

  .reservation-saved img {
    margin-top: 0;
  }
}
</style>
