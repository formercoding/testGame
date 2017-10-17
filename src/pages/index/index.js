// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import './assets/less/common.less'
import './../../../static/reset.css'

import {
    Dialog,
    Pagination,
    Loading,
    Message,
    Popover,
    Button
} from 'element-ui'

Vue.use(Dialog)
Vue.use(Pagination)
Vue.use(Loading)
Vue.use(Popover)
Vue.use(Button)

Vue.prototype.$message = Message

Vue.prototype.$http = axios;

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    template: '<App/>',
    components: { App }
});
