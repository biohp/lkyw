import Vue from 'vue'
import App from './App.vue'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import router from './router.js'
import store from './store'

Vue.use(iView)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
