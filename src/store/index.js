import Vue from 'vue'
import Vuex from 'vuex'
import layout from './modules/layout.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    layout
  },
})