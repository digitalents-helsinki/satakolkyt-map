import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import moment from 'moment'
import 'moment/locale/fi'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faTimes)
Vue.config.productionTip = false

moment.locale('fi')

Vue.use(require('vue-moment'), {
  moment
})
Vue.component('font-awesome-icon', FontAwesomeIcon)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
