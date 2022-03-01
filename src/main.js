import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import '@/plugins/vcharts' // echarts

import Verify from '@/components/verify'

Vue.use(ElementUI)

// 验证码
Vue.prototype.$verify = Verify

Vue.config.productionTip = false

Vue.prototype.baseUrl = process.env.NODE_ENV === 'development' ? process.env.VUE_APP_BASE_API : ''

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
