import Vue from 'vue'
import App from './App'
import store from './store'
import uniAsync from './js_sdk/uni_async'
import VueBus from './utils/vueBus.js'
import dayjs from 'dayjs'

Vue.config.productionTip = false
const fontUrl = 'https://6c69-likeday-f4b2b-1300778416.tcb.qcloud.la/font/LikeDayFont.woff2?sign=db0d0d8302b1c8277e56412c9d475718&t=1609659345'
uni.loadFontFace({
  family: 'LikeDayFont',
  global: true,
  source: `url("${fontUrl}")`,
  success: res => { console.log('字体加载成功', res) },
  fail: res => { console.log('字体加载失败', res) }
})
Vue.prototype.$uniAsync = uniAsync
Vue.prototype.$day = dayjs
Vue.use(VueBus)

App.mpType = 'app'

const app = new Vue({
  store, ...App
})
app.$mount()
