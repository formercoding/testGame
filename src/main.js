// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import setgame from './components/setgame'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import  './assets/less/common.less'
import BScroll from 'better-scroll'

import { Form, FormItem, Input, Radio, Dialog, Button, RadioGroup} from 'element-ui'
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Radio)
Vue.use(Dialog)
Vue.use(RadioGroup)
Vue.use(Button)




Vue.prototype.$http = axios;

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
