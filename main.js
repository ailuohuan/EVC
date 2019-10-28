import Vue from 'vue'
import App from './App'
import $app from './common/js/base.js'
import pageLoading from './components/pageloading.vue'
import base1 from './common/js/base1.js'

Vue.config.productionTip = false
Vue.component("page-loading",pageLoading);
Vue.prototype.app = $app;

App.mpType = 'app'
// Vue.prototype.baseUrl = 'http://evc.api.php.8kpay.com:10001/'
Vue.prototype.baseUrl = 'https://app.evcblock.tech'
Vue.prototype.$base1 = base1; 
const app = new Vue({
    ...App
})
app.$mount()
