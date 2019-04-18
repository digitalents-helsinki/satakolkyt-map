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
          <form v-on:submit.prevent="saveCleaned">
            <div class="modal-header">
              <h3>Ilmoita ranta siivotuksi</h3>
            </div>
            <div class="modal-body">
              <p>Siivouksen ajankohta</p>
              <input
                :required="required ? true : false"
                v-model="data.date"
                type="date"
              />
              <p>Rannan siivonnut taho</p>
              <input
                :required="required ? true : false"
                v-model="data.organizer_name"
                type="text"
              />
              <p>Yhteyshenkilön</p>
              <p>nimi</p>
              <input
                :required="required ? true : false"
                v-model="data.leader_name"
                type="text"
              />
              <p>sähköposti</p>
              <input
                :required="required ? true : false"
                v-model="data.leader_email"
                type="email"
              />
              <p>puhelinnumero</p>
              <input
                :required="required ? true : false"
                v-model="data.leader_phone"
                type="tel"
                pattern="[0-9]{3,11}"
              />
              <p>Montako osallistui siivoukseen</p>
              <input
                :required="required ? true : false"
                v-model="data.group_size"
                type="number"
              />
              <p>Kuinka paljon rannalta löytyi roskaa</p>
              <select
                :required="required ? true : false"
                v-model="data.trash_amount"
              >
                <optgroup label="vähäinen määrä">
                  <option value="1">ei juuri lainkaan</option>
                  <option value="2">muovipussillinen</option>
                </optgroup>
                <optgroup label="iso määrä">
                  <option value="3">jätesäkillinen</option>
                  <option value="4">monta jätesäkillistä</option>
                </optgroup>
              </select>
              <p>Jäikö rannalle pois vietäviä roskasäkkejä</p>
              <select
                :required="required ? true : false"
                v-model="data.trash_left"
              >
                <option value="yes">kyllä</option>
                <option value="no">ei</option>
              </select>
            </div>
            <div class="modal-footer">
              <button type="submit">
                OK
              </button>
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
import axios from 'axios'
export default {
  name: 'clean-modal',
  props: ['selected'],

  data() {
    return {
      data: {},
      saved: false,
      required: false
    }
  },
  mounted() {
    this.data.selected = this.$props.selected
  },
  methods: {
    saveCleaned() {
      axios({
        method: 'POST',
        url: 'http://' + location.hostname + ':8089/api/map/cleaninfo',

        data: this.data
      }).then(response => {})
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

.cross-icon {
  float: right;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
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
  margin-bottom: 1rem;
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
