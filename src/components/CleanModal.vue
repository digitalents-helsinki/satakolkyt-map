// Copyright (C) 2019 Digitalents Helsinki

<template>
  <div class="modal-mask">
    <div class="modal-wrapper" @click="$emit('close')">
      <div class="modal-container" @click.stop>
        <div class="closer">
          <font-awesome-icon
            icon="times"
            class="cross-icon"
            @click="$emit('close')"
          />
        </div>
        <div v-if="!saved && !loading">
          <div class="modal-page" v-show="pagenum == 0">
            <form v-on:submit.prevent="saveCleaned">
              <div class="modal-header">
                <h3>{{ $t('message.claim_clean') }}</h3>
              </div>
              <div class="modal-body">
                <div class="cleaned-info-item cleaner-organizer">
                  <h5>{{ $t('message.organizer_clean') }}</h5>
                  <input
                    :required="required"
                    v-model="cleandata.organizer_name"
                    type="text"
                    maxlength="40"
                  />
                </div>

                <div class="cleaned-info-item cleaned-time">
                  <h5>{{ $t('message.time_clean') }}</h5>
                  <div class="date-input">
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
                      v-model="cleandata.date"
                      @input="checkDateValidity"
                    />
                  </div>
                </div>
                <div class="date-error">{{ dateerrormsg }}</div>

                <div class="cleaned-info-item cleaner-count">
                  <h5>{{ $t('message.clean_count') }}</h5>
                  <input
                    :required="required"
                    v-model="cleandata.group_size"
                    type="number"
                    min="1"
                    max="999"
                  />
                </div>

                <div class="cleaned-info-item trash-amount">
                  <h5>{{ $t('message.trash_count') }}</h5>
                  <select :required="required" v-model="cleandata.trash_amount">
                    <option value="0" disabled selected hidden
                      >-- {{ $t('message.select_from_list') }} --</option
                    >
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
                      <label for="trashbagsyes">{{ $t('message.yes') }}</label>
                      <input
                        id="trashbagsyes"
                        type="radio"
                        name="trashbags"
                        value="yes"
                        :required="required"
                        v-model="cleandata.trash_left"
                      />
                    </div>
                    <div class="trash-bags-left-answer">
                      <label for="trashbagsno">{{ $t('message.no') }}</label>
                      <input
                        id="trashbagsno"
                        type="radio"
                        name="trashbags"
                        value="no"
                        :required="required"
                        v-model="cleandata.trash_left"
                      />
                    </div>
                  </div>
                </div>
                <div
                  class="trash-bags-where"
                  v-if="cleandata.trash_left === 'yes'"
                >
                  <p>
                    {{ $t('message.trash_bags_info') }}
                  </p>
                  <textarea
                    v-model="cleandata.trash_bags_info"
                    rows="2"
                    :required="cleandata.trash_left === 'yes' && required"
                    maxlength="60"
                  />
                </div>

                <div class="cleaner">
                  <div class="cleaner-title">
                    <h4>{{ $t('message.contact') }}</h4>
                    <p>{{ $t('message.shore_cleaner_fill') }}</p>
                  </div>

                  <div class="cleaned-info-item">
                    <h5>{{ $t('message.name') }}</h5>
                    <input
                      :required="required"
                      v-model="cleandata.leader_name"
                      type="text"
                      maxlength="40"
                    />
                  </div>
                  <div class="cleaned-info-item">
                    <h5>{{ $t('message.email') }}</h5>
                    <input
                      :required="required"
                      v-model="cleandata.leader_email"
                      type="email"
                      maxlength="40"
                    />
                  </div>
                  <div class="cleaned-info-item">
                    <h5>{{ $t('message.phonenumber') }}</h5>
                    <input
                      :required="required"
                      v-model="cleandata.leader_phone"
                      type="tel"
                      pattern="[0-9]{3,11}"
                      maxlength="12"
                    />
                  </div>
                </div>
              </div>
              <div class="modal-footer cleaned-footer-page1">
                <button @click.prevent="toNextPage">
                  {{ $t('message.next') }}
                </button>
              </div>
            </form>
          </div>
          <div class="modal-page" v-show="pagenum == 1">
            <form>
              <div class="modal-header">
                <h3>{{ $t('message.foreign_species') }}</h3>
                <p>{{ $t('message.foreign_species_info') }}</p>
              </div>
              <div class="modal-body">
                <div class="foreign-species">
                  <div class="foreign-species-input">
                    <h4>{{ $t('message.see_kurtturuusu') }}</h4>
                    <div class="label-radio">
                      <label for="kurttuyes">{{ $t('message.yes') }}</label>
                      <div>
                        <input
                          type="radio"
                          id="kurttuyes"
                          name="kurtturuusu"
                          value="yes"
                          v-model="cleandata.kurtturuusu"
                          :required="required"
                        />
                      </div>
                    </div>
                    <div class="label-radio">
                      <label for="kurttuno">{{ $t('message.no') }}</label>
                      <div>
                        <input
                          type="radio"
                          id="kurttuno"
                          name="kurtturuusu"
                          value="no"
                          v-model="cleandata.kurtturuusu"
                          :required="required"
                        />
                      </div>
                    </div>
                    <div class="label-radio">
                      <label for="kurttuidk">{{ $t('message.unsure') }}</label>
                      <div>
                        <input
                          type="radio"
                          id="kurttuidk"
                          name="kurtturuusu"
                          value="idk"
                          v-model="cleandata.kurtturuusu"
                          :required="required"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="foreign-species-photo">
                    <img alt="Kurtturuusu" src="../img/kurtturuusu.jpg" />
                    <p>{{ $t('message.photo') }}: Johanna Kolehmainen</p>
                  </div>
                </div>
                <div class="foreign-species-detail">
                  <h5>{{ $t('message.foreign_species1_detail') }}</h5>
                  <p>{{ $t('message.foreign_species1_detail_sub') }}</p>
                  <textarea
                    rows="3"
                    v-model="cleandata.kurtturuusu_detail"
                    :required="cleandata.kurtturuusu === 'yes' && required"
                    maxlength="200"
                  />
                </div>

                <div class="foreign-species">
                  <div class="foreign-species-input">
                    <h4>{{ $t('message.see_jattipalsami') }}</h4>
                    <div class="label-radio">
                      <label for="jattiyes">{{ $t('message.yes') }}</label>
                      <div>
                        <input
                          type="radio"
                          id="jattiyes"
                          name="jattipalsami"
                          value="yes"
                          v-model="cleandata.jattipalsami"
                          :required="required"
                        />
                      </div>
                    </div>
                    <div class="label-radio">
                      <label for="jattino">{{ $t('message.no') }}</label>
                      <div>
                        <input
                          type="radio"
                          id="jattino"
                          name="jattipalsami"
                          value="no"
                          v-model="cleandata.jattipalsami"
                          :required="required"
                        />
                      </div>
                    </div>
                    <div class="label-radio">
                      <label for="jattiidk">{{ $t('message.unsure') }}</label>
                      <div>
                        <input
                          type="radio"
                          id="jattiidk"
                          name="jattipalsami"
                          value="idk"
                          v-model="cleandata.jattipalsami"
                          :required="required"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="foreign-species-photo">
                    <img alt="Jättipalsami" src="../img/jattipalsami.jpg" />
                    <p>{{ $t('message.photo') }}: Terhi Ryttäri</p>
                  </div>
                </div>
                <div class="foreign-species-detail">
                  <h5>{{ $t('message.foreign_species2_detail') }}</h5>
                  <p>{{ $t('message.foreign_species2_detail_sub') }}</p>
                  <textarea
                    rows="3"
                    v-model="cleandata.jattipalsami_detail"
                    :required="cleandata.jattipalsami === 'yes' && required"
                    maxlength="200"
                  />
                </div>
              </div>
              <div class="modal-footer">
                <button @click.prevent="toPrevPage">
                  {{ $t('message.previous') }}
                </button>
                <button @click.prevent="toNextPage">
                  {{ $t('message.next') }}
                </button>
              </div>
            </form>
          </div>
          <div class="modal-page" v-show="pagenum == 2">
            <form>
              <div class="modal-header">
                <h3>{{ $t('message.clean_additional_info') }}</h3>
                <p>{{ $t('message.clean_additional_info_sub') }}</p>
              </div>
              <div class="modal-body">
                <div class="something-else">
                  <h4>{{ $t('message.clean_something_else') }}</h4>
                  <textarea
                    rows="4"
                    v-model="cleandata.cleanmoreinfo"
                    maxlength="200"
                  />
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
                <button @click.prevent="toPrevPage">
                  {{ $t('message.previous') }}
                </button>
                <button @click="saveCleaned">
                  {{ $t('message.send') }}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div v-if="!saved && loading" class="spinner-container">
          <spinner />
        </div>
        <div v-if="saved && !loading">
          <div class="modal-header">
            <div class="clean-saved">
              <img src="img/fisu.gif" alt="" />
              <h1 class="success">{{ $t('message.cleaned_saved') }}</h1>
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
import Spinner from '@/components/Spinner'
import Datepicker from 'vuejs-datepicker'
import axios from 'axios'
import { fi, en, sv } from 'vuejs-datepicker/dist/locale'
export default {
  components: { Spinner, Datepicker },
  name: 'clean-modal',
  props: ['selected'],

  data() {
    return {
      cleandata: {
        confirmed: false,
        organizer_name: '',
        date: '',
        group_size: 1,
        trash_amount: 0,
        trash_left: 'no',
        trash_bags_info: '',
        cleanmoreinfo: '',
        leader_name: '',
        leader_email: '',
        leader_phone: '',
        kurtturuusu: 'no',
        jattipalsami: 'no',
        kurtturuusu_detail: '',
        jattipalsami_detail: ''
      },
      privacy_permission: false,
      saved: false,
      loading: false,
      required: true,
      pagenum: 0,
      dateerrormsg: '',
      fi: fi,
      en: en,
      sv: sv
    }
  },
  mounted() {
    this.cleandata.selected = this.$props.selected
  },
  methods: {
    saveCleaned(e) {
      if (e.target.form.reportValidity()) {
        if (!this.checkDateValidity()) {
          return
        }
        this.loading = true
        this.cleandata.date = this.cleandata.date.toISOString().substring(0, 10)
        axios({
          method: 'POST',
          url: process.env.VUE_APP_URL + '/api/map/cleaninfo',
          data: this.cleandata
        })
          .then(res => {
            if (res.data.status === 'ok') {
              this.$emit('cleaned-ok', res.data.json)
              this.loading = false
              this.saved = true
            }
          })
          .catch(err => {
            this.$emit('error-msg', err.response.data.error)
          })
      }
    },
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
    checkDateValidity() {
      const tempDate = this.cleandata.date.toISOString().substring(0, 10)
      const d = tempDate.split('-')
      const date = new Date(
        parseInt(d[0]),
        parseInt(d[1]) - 1,
        parseInt(d[2]),
        0,
        0,
        0,
        0
      )

      const now = new Date()
      if (date > now) {
        this.dateerrormsg = this.$t('message.date_in_past')
        return false
      } else {
        this.dateerrormsg = ''
        return true
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
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  position: relative;
  width: 550px;
  height: 80vh;
  margin-left: 50px;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  overflow-y: auto;
}

.closer {
  position: absolute;
  font-size: 30px;
  cursor: pointer;
  right: 10px;
  top: 0;
  padding: 20px;
}

.modal-page {
  height: 100%;
}

.modal-header {
  margin-top: 1rem;
}

.modal-header h3 {
  font-weight: 800;
  font-size: 20px;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}

.modal-header p,
.modal-body p {
  font-size: 12px;
  color: #555;
}

.modal-body {
  margin: 20px 0;
  padding-right: 20px;
  margin-right: 5px;
  flex: 1;
}

.cleaner {
  margin: 2rem 0;
}

.cleaner-organizer h5 {
  flex-basis: 40%;
}

.cleaner-organizer input {
  margin-left: 18px;
}

.cleaner-title {
  margin: 10px 0 10px 0;
  padding-top: 20px;
  border-top: 1px dashed #bbb;
}

.cleaner-title h4 {
  text-transform: uppercase;
  margin-bottom: 10px;
}

.modal-body h4 {
  font-size: 18px;
  font-weight: 700;
}

.cleaned-info-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 10px 0;
}

.cleaner .cleaned-info-item h5 {
  width: 50%;
}

.cleaned-time h5 {
  flex-basis: 30%;
  margin-right: 10px;
}

.date-input {
  position: relative;
  margin-right: 153px;
}

.date-input svg {
  position: absolute;
  top: 6px;
  left: 8px;
  z-index: 101;
}

.date-error {
  margin: 0px 0 10px 0;
  font-size: 14px;
  color: #f82828;
}

.cleaned-info-item h5 {
  font-weight: 600;
  font-size: 16px;
}

.cleaner-count h5 {
  flex: 1;
}

.cleaner-count input {
  flex-basis: 15%;
}

.trash-amount {
  margin: 20px 0;
  padding: 30px 0 0 0;
  border-top: 1px dashed #bbb;
}

.trash-amount h5 {
  flex-basis: 70%;
}

.trash-amount select {
  flex-basis: 70%;
  width: 50px;
}

.trash-bags-left {
  margin-bottom: 1rem;
  flex-flow: row wrap;
}

.trash-bags-left h5 {
  margin-bottom: 0.7rem;
  flex-basis: 100%;
}

.trash-bags-left-radios {
  display: flex;
}

.trash-bags-left-radios div input {
  width: 15px;
}

.trash-bags-left-answer {
  margin-right: 40px;
  display: flex;
}

.trash-bags-where p {
  margin-bottom: 0.5rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.foreign-species {
  display: flex;
  margin: 25px 0 15px 0;
  padding-top: 20px;
  border-top: 1px dashed #bbb;
}

.foreign-species-input {
  display: flex;
  flex-direction: column;
  margin-right: 15px;
  width: 75%;
}

.foreign-species-input h4 {
  margin-bottom: 0.5rem;
}

.label-radio {
  display: flex;
  justify-content: space-around;
  margin: 0.7rem 20px;
  width: 70%;
}

.label-radio label {
  width: 100%;
}

.label-radio div {
  display: flex;
  align-content: center;
}

.label-radio div input {
  width: 15px;
}

.foreign-species-detail h5 {
  font-weight: bold;
  margin: 10px 0;
}

.foreign-species-detail p {
  margin-bottom: 0.5rem;
}

.something-else h4 {
  margin: 3rem 0 1rem 0;
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
  line-height: 1.3;
  color: black;
  cursor: pointer;
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

.clean-saved img {
  max-width: 300px;
  display: block;
  margin: 50px auto 30px auto;
}

.clean-saved button {
  display: block;
  margin: 0 auto;
}

h1 {
  font-weight: bold;
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
input[type='number'] {
  max-width: 70px;
}
input[type='radio'] {
  padding: 0;
  margin: 0 0 0 5px;
}
select {
  padding: 5px;
  width: 100%;
  border: 1px solid #bbb;
  background-color: white;
}
.success {
  color: #006b32;
  font-size: 24px;
  text-align: center;
  margin: 20px 0;
}
textarea {
  border: 1px solid #bbb;
  resize: none;
  width: 100%;
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
    width: 350px;
    height: 90vh;
    margin-left: 5px;
    padding: 15px;
  }

  .modal-header h3 {
    max-width: 250px;
  }

  .modal-body {
    padding-right: 0;
  }

  .cleaner .cleaned-info-item {
    flex-direction: column;
  }

  .cleaner .cleaned-info-item h5 {
    width: 100%;
    margin-bottom: 5px;
  }

  .cleaner .cleaned-info-item input {
    margin-left: 0;
    margin-bottom: 5px;
  }

  .cleaner-organizer,
  .cleaned-time {
    flex-direction: column;
    align-items: flex-start;
  }

  .cleaner-organizer h5,
  .cleaned-time h5 {
    margin-bottom: 5px;
  }

  .cleaner-organizer input,
  .cleaned-time input {
    margin: 0;
  }

  .cleaner-organizer input {
    max-width: 180px;
  }

  .date-input {
    margin-left: 0;
  }

  .foreign-species-input {
    margin-right: 5px;
  }

  .foreign-species-photo img {
    margin-top: 30px;
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

  .clean-saved img {
    margin-top: 0;
  }
}
</style>
