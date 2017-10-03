// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import setgame from './../../components/setgame'
import App from './App'
import store from './store'
import axios from 'axios'
import  './assets/less/common.less'
import Vuebar from 'vuebar'; 
import './../../../static/reset.css';
import './../../../static/reset.css';
import qs from 'qs'

import { Form, FormItem, Input, Radio, Dialog, Button, RadioGroup, Pagination, Loading, Message} from 'element-ui'
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

// Vue.use(router)

// node_modules/vuebar/vuebar.js
// 将插件的最后几行中的Vue.use(Vuebar)删除或注释
Vue.use(Vuebar);




Vue.prototype.$http = axios;

Vue.config.productionTip = false


axios.defaults.timeout = 10000;
let loadinginstace;
//POST传参序列化(添加请求拦截器)
axios.interceptors.request.use((config) => {
    loadinginstace = Loading.service({ fullscreen: true }) //element ui loading方法
    //在发送请求之前做某件事
    // if(config.method  === 'post'){
    //     config.data = qs.stringify(config.data);
    // }
    return config;
},(error) =>{
    loadinginstace.close(); //关闭加载状态
     Message.error({
        message: '请求参数错误，请刷新重试'
    })
    return Promise.reject(error);
});
//返回状态判断(添加响应拦截器)
axios.interceptors.response.use((res) =>{
    loadinginstace.close()
    //对响应数据做些事
    if(res.data.return_code!='SUCCESS'){
        return Promise.reject(res);
    }
    return res;
}, (error) => {
        loadinginstace.close()
        if (error.response) {
            Message.error({
                message: error.response.status + ':网络错误，请刷新重试'
            })
        } else {
            Message.error({
                message: '请求错误，请刷新重试'
            })
        }
    return Promise.reject(error);
});



/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  template: '<App/>',
  components: { App }
})
