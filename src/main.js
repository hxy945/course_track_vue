import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
/* 引入全局样式表 */
import './assets/css/global.css'

import axios from 'axios'
//配置请求的跟路径
// axios.defaults.baseURL = "http://timemeetyou.com:8889/api/private/v1/"
axios.defaults.baseURL = "http://localhost:8081/"
// axios.defaults.baseURL = "http://42.194.196.25:8081/"
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios




Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
