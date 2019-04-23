import Vue from 'vue'
import VTooltip from 'v-tooltip'
import App from './App.vue'
import router from './router'
import store from './store'

import './registerServiceWorker'
import moment from 'moment'
import 'moment/locale/fi'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import { faLanguage } from '@fortawesome/free-solid-svg-icons'
import VueI18n from 'vue-i18n'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import messages from './translation'
library.add(faTimes)
library.add(faQuestionCircle)
library.add(faLanguage)
Vue.config.productionTip = false

moment.locale('fi')
Vue.use(VTooltip)
Vue.use(VueI18n)

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages // set locale messages
})
i18n.locale = window.navigator.userLanguage || window.navigator.language
Vue.use(require('vue-moment'), {
  moment
})
Vue.component('font-awesome-icon', FontAwesomeIcon)
new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
