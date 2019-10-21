import Vue from 'vue'
import App from './App'
import base from './common/js/base.js'
Vue.config.productionTip = false

App.mpType = 'app'

Vue.prototype.baseUrl = 'http://evc.api.php.8kpay.com:10001'
Vue.prototype.$base = base; 
const app = new Vue({
    ...App
})
app.$mount()
