import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations } from 'vuexfire'
import ErrorsPlugin from './errors-plugin'
import alerts from './modules/alerts'
import auth from './modules/auth'
import data from './modules/data'

Vue.use(Vuex)

export default new Vuex.Store({
  mutations: {
    ...vuexfireMutations
  },
  modules: {
    alerts,
    auth,
    data
  },
  plugins: [ErrorsPlugin],
  strict: process.env.NODE_ENV !== 'production'
})
