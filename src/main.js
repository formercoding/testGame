// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import setgame from './components/setgame'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import  './assets/less/common.less'
import Vuebar from 'vuebar'; 
import './../static/reset.css';

import { Form, FormItem, Input, Radio, Dialog, Button, RadioGroup, Pagination, Loading} from 'element-ui'
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Radio)
Vue.use(Dialog)
Vue.use(RadioGroup)
Vue.use(Button)
Vue.use(Pagination)
Vue.use(Loading)
Vue.use(router)

// node_modules/vuebar/vuebar.js
// 将插件的最后几行中的Vue.use(Vuebar)删除或注释
Vue.use(Vuebar);



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
