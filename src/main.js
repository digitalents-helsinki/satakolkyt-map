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

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faTimes)
library.add(faQuestionCircle)
Vue.config.productionTip = false

moment.locale('fi')
Vue.use(VTooltip)
Vue.use(require('vue-moment'), {
  moment
})
Vue.component('font-awesome-icon', FontAwesomeIcon)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
