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
                    :required="required ? true : false"
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
                        :required="required ? true : false"
                        v-model="reservationdata.startdate"
                        type="date"
                      />
                    </div>
                    <div class="datetime-item">
                      <font-awesome-icon icon="clock" />

                      <vue-timepicker
                        class="timepicker"
                        :required="required ? true : false"
                        v-model="reservationdata.starttime"
                        format="HH:mm"
                      />
                    </div>
                    <span>-</span>
                    <div class="datetime-item">
                      <font-awesome-icon icon="calendar" />

                      <input
                        :required="required ? true : false"
                        v-model="reservationdata.enddate"
                        type="date"
                      />
                    </div>
                    <div class="datetime-item">
                      <font-awesome-icon icon="clock" />

                      <vue-timepicker
                        class="timepicker"
                        :required="required ? true : false"
                        v-model="reservationdata.endtime"
                        format="HH:mm"
                      />
                    </div>
                  </div>
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
                    v-show="reservationdata.openevent"
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
                      :required="required ? true : false"
                      v-model="reservationdata.name"
                      type="text"
                    />
                  </div>
                  <div class="input-field">
                    <h5>{{ $t('message.email') }}</h5>
                    <input
                      :required="required ? true : false"
                      v-model="reservationdata.email"
                      type="email"
                    />
                  </div>
                  <div class="input-field">
                    <h5>{{ $t('message.phonenumber') }}</h5>
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
  name: 'reserve-modal',
  props: ['selected'],

  data() {
    return {
      saved: false,
      required: false,
      errors: [],
      reservationdata: {
        confirmed: false,
        starttime: {
          hh: '',
          mm: ''
        },
        endtime: {
          hh: '',
          mm: ''
        },
        openevent: false,
        openinfo: '',
        openlink: ''
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
  width: 600px;
  height: 80vh;
  margin-left: 5%;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
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
.modal-body {
  margin: 20px 0;
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

.modal-footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: right;
}

.modal-default-button {
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
