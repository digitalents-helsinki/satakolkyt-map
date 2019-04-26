import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'

import Vue from 'vue'
import VTooltip from 'v-tooltip'
import App from './App.vue'
import router from './router'
import store from './store'
import vueHeadful from 'vue-headful'
import './registerServiceWorker'
import moment from 'moment'
import 'moment/locale/fi'

import 'moment/locale/sv'
import VueOffline from 'vue-offline'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import VueI18n from 'vue-i18n'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { messages } from './translation'
library.add(faTimes)
library.add(faQuestionCircle)
Vue.config.productionTip = false

Vue.use(VTooltip)
Vue.use(VueI18n)
Sentry.init({
  dsn: 'https://04bfcb6dc6534683894daf06d484339f@sentry.io/1446248',
  integrations: [
    new Integrations.Vue({
      Vue,
      attachProps: true
    })
  ]
})

Sentry.configureScope(scope => {
  scope.setTag('page_locale', navigator.language)
})

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages // set locale messages
})
i18n.locale = navigator.language
moment.locale(i18n.locale)

Vue.use(require('vue-moment'), {
  moment
})
Vue.use(VueOffline)
Vue.component('vue-headful', vueHeadful)
Vue.component('font-awesome-icon', FontAwesomeIcon)
new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
