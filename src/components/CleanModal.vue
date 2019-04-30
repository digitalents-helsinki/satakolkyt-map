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
            <div v-show="pagenum == 0">
              <div class="modal-header">
                <h3>{{ $t('message.claim_clean') }}</h3>
                <p>Täytä siivotun rannan tiedot</p>
              </div>
              <div class="modal-body">
                <div class="cleaned-info-item cleaned-time">
                  <h5>{{ $t('message.time_clean') }}</h5>
                  <font-awesome-icon icon="calendar" />
                  <input :required="required" v-model="data.date" type="date" />
                </div>

                <div class="cleaner">
                  <div class="cleaner-title">
                    <h4>Rannan siivonnut taho</h4>
                    <p>Täytä alle yhteyshenkilön tiedot</p>
                  </div>

                  <div class="cleaned-info-item">
                    <h5>{{ $t('message.organizer_clean') }}</h5>
                    <input
                      :required="required"
                      v-model="data.organizer_name"
                      type="text"
                    />
                  </div>

                  <div class="cleaned-info-item">
                    <h5>{{ $t('message.name') }}</h5>
                    <input
                      :required="required"
                      v-model="data.leader_name"
                      type="text"
                    />
                  </div>
                  <div class="cleaned-info-item">
                    <h5>{{ $t('message.email') }}</h5>
                    <input
                      :required="required"
                      v-model="data.leader_email"
                      type="email"
                    />
                  </div>
                  <div class="cleaned-info-item">
                    <h5>{{ $t('message.phonenumber') }}</h5>
                    <input
                      :required="required"
                      v-model="data.leader_phone"
                      type="tel"
                      pattern="[0-9]{3,11}"
                    />
                  </div>
                </div>

                <div class="cleaned-info-item cleaner-count">
                  <h5>{{ $t('message.clean_count') }}</h5>
                  <input
                    :required="required"
                    v-model="data.group_size"
                    type="number"
                  />
                </div>

                <div class="cleaned-info-item trash-amount">
                  <h5>{{ $t('message.trash_count') }}</h5>
                  <select :required="required" v-model="data.trash_amount">
                    <option value="1">{{ $t('message.trash_little') }}</option>
                    <option value="2">{{ $t('message.trash_small') }}</option>
                    <option value="3">{{ $t('message.trash_medium') }}</option>
                    <option value="4">{{ $t('message.trash_large') }}</option>
                  </select>
                </div>

                <div class="cleaned-info-item trash-bags-left">
                  <h5>{{ $t('message.trash_left') }}</h5>
                  <div class="trash-bags-left-radios">
                    <div class="trash-bags-left-answer">
                      <label for="trashbagsyes">Kyllä</label>
                      <input
                        id="trashbagsyes"
                        type="radio"
                        name="trashbags"
                        value="yes"
                        :required="required"
                        v-model="data.trash_left"
                      />
                    </div>
                    <div class="trash-bags-left-answer">
                      <label for="trashbagsno">Ei</label>
                      <input
                        id="trashbagsno"
                        type="radio"
                        name="trashbags"
                        value="no"
                        :required="required"
                        v-model="data.trash_left"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer cleaned-footer-page1">
                <button @click.prevent="toNextPage">
                  Seuraava
                </button>
              </div>
            </div>
            <div v-show="pagenum == 1">
              <div class="modal-header">
                <h3>{{ $t('message.foreign_species') }}</h3>
                <p>{{ $t('message.foreign_species_info') }}</p>
              </div>
              <div class="modal-body">
                <div class="foreign-species">
                  <h4>Havaitsitteko rannalla kurtturuusua?</h4>
                  <label for="kurttuyes">Kyllä</label>
                  <input
                    type="radio"
                    id="kurttuyes"
                    name="kurtturuusu"
                    value="yes"
                    v-model="data.kurtturuusu"
                    :required="required"
                  />
                  <label for="kurttuno">Ei</label>
                  <input
                    type="radio"
                    id="kurttuno"
                    name="kurtturuusu"
                    value="no"
                    v-model="data.kurtturuusu"
                    :required="required"
                  />
                  <label for="kurttuidk">En osaa sanoa</label>
                  <input
                    type="radio"
                    id="kurttuidk"
                    name="kurtturuusu"
                    value="idk"
                    v-model="data.kurtturuusu"
                    :required="required"
                  />
                </div>
                <div class="foreign-species">
                  <h4>Havaitsitteko rannalla jättipalsamia?</h4>
                  <label for="jattiyes">Kyllä</label>
                  <input
                    type="radio"
                    id="jattiyes"
                    name="jattipalsami"
                    value="yes"
                    v-model="data.jattipalsami"
                    :required="required"
                  />
                  <label for="jattino">Ei</label>
                  <input
                    type="radio"
                    id="jattino"
                    name="jattipalsami"
                    value="no"
                    v-model="data.jattipalsami"
                    :required="required"
                  />
                  <label for="jattiidk">En osaa sanoa</label>
                  <input
                    type="radio"
                    id="jattiidk"
                    name="jattipalsami"
                    value="idk"
                    v-model="data.jattipalsami"
                    :required="required"
                  />
                </div>
              </div>
              <h4>Voitte kuvailla lajiesiintymiä tarkemmin</h4>
              <h5>Missä kohtaa vieraslajia esiintyy ja kuinka paljon?</h5>
              <textarea rows="4" v-model="data.foreignspeciesdetail" />
              <div class="modal-footer">
                <button @click.prevent="toPrevPage">
                  Edellinen
                </button>
                <button @click.prevent="toNextPage">
                  Seuraava
                </button>
              </div>
            </div>
            <div v-show="pagenum == 2">
              <div class="modal-header">
                <h3>{{ $t('message.clean_additional_info') }}</h3>
                <p>Lisätietojen täyttäminen on vapaaehtoista</p>
              </div>
              <div class="modal-body">
                <h4>Jotain muuta, mitä haluatte kertoa?</h4>
                <textarea rows="4" v-model="data.cleanmoreinfo" />
              </div>
              <div class="modal-footer">
                <button @click.prevent="toPrevPage">
                  Edellinen
                </button>
                <button type="submit">
                  OK
                </button>
              </div>
            </div>
          </form>
        </template>
        <template v-if="saved">
          <div class="modal-header">
            <slot name="header">
              <h1 class="success">{{ $t('message.cleaned_saved') }}</h1>
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
import axios from 'axios'
export default {
  name: 'clean-modal',
  props: ['selected'],

  data() {
    return {
      data: {},
      saved: false,
      required: false,
      pagenum: 0
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
      }).then(response => {
        this.$emit('close')
      })
    },
    toNextPage() {
      this.pagenum++
    },
    toPrevPage() {
      this.pagenum--
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
  width: 550px;
  height: 80vh;
  margin-left: 50px;
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
  color: #888;
}

.modal-body {
  margin: 20px 0;
}

.cleaner {
  margin: 2rem 0;
}

.cleaner-title {
  margin: 2rem 0 1rem 0;
}

.modal-body h4 {
  font-size: 20px;
  font-weight: 600;
}

.cleaned-info-item {
  display: flex;
  align-items: center;
  margin: 0 0 10px 0;
}

.cleaner .cleaned-info-item h5 {
  width: 50%;
}

.cleaned-time h5 {
  width: 35%;
}

.cleaned-info-item h5 {
  font-weight: 600;
  font-size: 16px;
  margin-right: 20px;
}

.cleaner-count input {
  max-width: 70px;
}

.trash-amount {
  margin: 2rem 0;
}

.trash-amount select {
  max-width: 200px;
}

.trash-bags-left {
  flex-direction: column;
  margin-bottom: 3rem;
}

.trash-bags-left h5 {
  margin-bottom: 0.7rem;
}

.trash-bags-left-radios {
  display: flex;
}

.trash-bags-left-answer {
  display: flex;
  margin: 0 50px;
}

.modal-footer div {
  margin-bottom: 20px;
}

.cleaned-footer-page1 {
  display: flex;
  justify-content: right;
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
  padding: 5px;
  margin: 0 0 0 10px;
  box-sizing: border-box;
  border: 1px solid #bbb;
  width: 100%;
}
input[type='date'] {
  max-width: 140px;
}
select {
  padding: 5px;
  width: 100%;
  border: none;
  border-radius: 4px;
  background-color: #f1f1f1;
}
.success {
  color: green;
}
textarea {
  border: 1px solid #bbb;
  resize: none;
  width: 100%;
}
button {
  background-color: #00a0ff;
  color: white;
}
</style>
