// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'
import axios from 'axios'
import Vuebar from 'vuebar';
import './../../common/common.less'
import './../../../static/reset.css';
import qs from 'qs'

import { 
    Form, 
    FormItem, 
    Input, 
    Radio, 
    Dialog, 
    Button, 
    RadioGroup, 
    Pagination, 
    Loading, 
    Message
} from 'element-ui'

Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Radio)
Vue.use(Dialog)
Vue.use(RadioGroup)
Vue.use(Button)
Vue.use(Pagination)
Vue.use(Loading)

Vue.prototype.$message = Message

// node_modules/vuebar/vuebar.js
// 将插件的最后几行中的Vue.use(Vuebar)删除或注释
Vue.use(Vuebar);

Vue.prototype.$http = axios;

Vue.config.productionTip = false

axios.defaults.timeout = 10000; // 设置网络延迟 会触发请求错误

// 返回过滤器 获取csrf
axios.interceptors.response.use(
  // 正确处理
  res => {
    let csrf = res.headers._csrf;
    
    if(csrf){
        store.state._csrf = csrf;
    }

    return res;
  }
);

// 添加csrf
axios.interceptors.request.use((config) => {
    //在发送请求之前做某件事
    if(config.method  === 'post' && store.state._csrf && !config.url.match('medialibs')){
        if(config.params) {
            config.params._csrf = store.state._csrf;
        } else {
            config.params = {
                _csrf: store.state._csrf
            }
        }
    }
    return config;
});



/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  template: '<App/>',
  components: { App }
})
