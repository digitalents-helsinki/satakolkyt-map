<template>
  <div class="modal-mask">
    <div class="modal-wrapper" @click="$emit('close')">
      <div class="modal-container" @click.stop>
        <template v-if="!saved">
          <div class="modal-page" v-show="pagenum == 0">
            <form>
              <div class="modal-header">
                <h3>{{ $t('message.claim_clean') }}</h3>
                <p>{{ $t('message.fill_cleaned_info') }}</p>
              </div>
              <div class="modal-body">
                <div class="cleaned-info-item cleaner-organizer">
                  <h5>{{ $t('message.organizer_clean') }}</h5>
                  <input
                    :required="required"
                    v-model="data.organizer_name"
                    type="text"
                  />
                </div>

                <div class="cleaned-info-item cleaned-time">
                  <h5>{{ $t('message.time_clean') }}</h5>
                  <font-awesome-icon icon="calendar" />
                  <input :required="required" v-model="data.date" type="date" />
                </div>

                <div class="cleaned-info-item cleaner-count">
                  <h5>{{ $t('message.clean_count') }}</h5>
                  <input
                    :required="required"
                    v-model="data.group_size"
                    type="number"
                    min="1"
                    max="999"
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
                      <label for="trashbagsyes">{{ $t('message.yes') }}</label>
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
                      <label for="trashbagsno">{{ $t('message.no') }}</label>
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
                <div class="trash-bags-where">
                  <p>
                    {{ $t('message.trash_bags_info') }}
                  </p>
                  <textarea
                    v-model="data.trash_bags_info"
                    rows="2"
                    :required="data.trash_left === 'yes' && required"
                  />
                </div>

                <div class="something-else">
                  <h4>{{ $t('message.clean_something_else') }}</h4>
                  <textarea rows="4" v-model="data.cleanmoreinfo" />
                </div>

                <div class="cleaner">
                  <div class="cleaner-title">
                    <h4>{{ $t('message.shore_cleaner') }}</h4>
                    <p>{{ $t('message.shore_cleaner_fill') }}</p>
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
                      <input
                        type="radio"
                        id="kurttuyes"
                        name="kurtturuusu"
                        value="yes"
                        v-model="data.kurtturuusu"
                        :required="required"
                      />
                    </div>
                    <div class="label-radio">
                      <label for="kurttuno">{{ $t('message.no') }}</label>
                      <input
                        type="radio"
                        id="kurttuno"
                        name="kurtturuusu"
                        value="no"
                        v-model="data.kurtturuusu"
                        :required="required"
                      />
                    </div>
                    <div class="label-radio">
                      <label for="kurttuidk">{{ $t('message.unsure') }}</label>
                      <input
                        type="radio"
                        id="kurttuidk"
                        name="kurtturuusu"
                        value="idk"
                        v-model="data.kurtturuusu"
                        :required="required"
                      />
                    </div>
                  </div>
                  <div class="foreign-species-photo">
                    <img alt="Kurtturuusu" src="../img/kurtturuusu.jpg" />
                    <p>{{ $t('message.photo') }}: Johanna Kolehmainen</p>
                  </div>
                </div>

                <div class="foreign-species">
                  <div class="foreign-species-input">
                    <h4>{{ $t('message.see_jattipalsami') }}</h4>
                    <div class="label-radio">
                      <label for="jattiyes">{{ $t('message.yes') }}</label>
                      <input
                        type="radio"
                        id="jattiyes"
                        name="jattipalsami"
                        value="yes"
                        v-model="data.jattipalsami"
                        :required="required"
                      />
                    </div>
                    <div class="label-radio">
                      <label for="jattino">{{ $t('message.no') }}</label>
                      <input
                        type="radio"
                        id="jattino"
                        name="jattipalsami"
                        value="no"
                        v-model="data.jattipalsami"
                        :required="required"
                      />
                    </div>
                    <div class="label-radio">
                      <label for="jattiidk">{{ $t('message.unsure') }}</label>
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
                  <div class="foreign-species-photo">
                    <img alt="Jättipalsami" src="../img/jattipalsami.jpg" />
                    <p>{{ $t('message.photo') }}: Terhi Ryttäri</p>
                  </div>
                </div>
                <div class="foreign-species-detail">
                  <h4>{{ $t('message.foreign_species_detail1') }}</h4>
                  <p>{{ $t('message.foreign_species_detail2') }}</p>
                  <textarea
                    rows="4"
                    v-model="data.foreignspeciesdetail"
                    :required="
                      (data.kurtturuusu === 'yes' ||
                        data.jattipalsami === 'yes') &&
                        required
                    "
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
                <div class="permission-container">
                  <span
                    class="privacy-policy-button"
                    @click="$emit('show-privacy-info')"
                    ><h4>Privacy policy</h4></span
                  >
                  <h4>{{ $t('message.submit_permission_text') }}</h4>
                  <input
                    type="checkbox"
                    v-model="privacy_permission"
                    required
                  />
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
      data: {
        organizer_name: '',
        date: '',
        group_size: 1,
        trash_amount: 0,
        trash_left: '',
        trash_bags_info: '',
        cleanmoreinfo: '',
        leader_name: '',
        leader_email: '',
        leader_phone: '',
        kurtturuusu: '',
        jattipalsami: '',
        foreignspeciesdetail: ''
      },
      privacy_permission: false,
      saved: false,
      required: true,
      pagenum: 0
    }
  },
  mounted() {
    this.data.selected = this.$props.selected
  },
  methods: {
    saveCleaned(e) {
      if (e.target.form.reportValidity()) {
        axios({
          method: 'POST',
          url: 'http://' + location.hostname + ':8089/api/map/cleaninfo',
          data: this.data
        })
          .then(res => {
            if (res.data.status === 'ok') {
              this.$emit('cleaned-ok', res.data.json)
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
        this.pagenum++
      }
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
  padding-left: 20px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  overflow-y: auto;
}
@media only screen and (max-width: 600px) {
  .modal-container {
    width: 95%;
  }
}

.modal-page {
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  margin: 20px 0;
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
  overflow-y: auto;
}

.cleaner {
  margin: 2rem 0;
}

.cleaner-organizer h5 {
  flex-basis: 40%;
}

.cleaner-title {
  margin: 2rem 0 1rem 0;
  text-transform: uppercase;
}

.modal-body h4 {
  font-size: 18px;
  font-weight: 700;
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
  flex-basis: 30%;
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
  margin: 2rem 0;
}

.trash-amount h5 {
  flex-basis: 70%;
}

.trash-amount select {
  flex-basis: 70%;
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
  margin-left: 2rem;
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
  margin: 2rem 0;
}

.foreign-species-input {
  display: flex;
  flex-direction: column;
  margin-right: 5px;
  width: 75%;
}

.foreign-species-input h4 {
  margin-bottom: 0.5rem;
}

.label-radio {
  display: flex;
  margin: 0.7rem 0;
}

.label-radio label {
  width: 100%;
}

.foreign-species-detail h4 {
  margin: 0.5rem 0;
}

.foreign-species-detail p {
  margin-bottom: 0.5rem;
}

.something-else h4 {
  margin: 3rem 0 1rem 0;
}

.modal-default-button {
  width: 100%;
  margin-bottom: 5px;
}

.permission-container {
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
