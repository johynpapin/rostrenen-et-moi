import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { auth } from './plugins/firebase'
import './plugins/vee-validate'
import './plugins/vue-meta'
import vuetify from './plugins/vuetify'
import './filters'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

function pushIfNotAlreadyThere (name) {
  if (router.currentRoute.name !== name) {
    router.push({
      name
    })
  }
}

function cleanState () {
  store.dispatch('auth/stopFetchingUserInfo')
  store.dispatch('data/stopFetchingAnomalies')
  store.dispatch('data/stopFetchingTypes')
  store.dispatch('data/stopFetchingUsers')
  store.dispatch('data/stopFetchingNotifications')
}

auth.onIdTokenChanged(user => {
  console.debug('onIdTokenChanged', !!user, store.state.auth.isAuthenticated)

  if (!user && store.state.auth.isAuthenticated) {
    console.debug('cleaning state')
    cleanState()
    pushIfNotAlreadyThere('AuthSignIn')
  }

  store.commit('auth/setIsAuthenticated', !!user)
  store.commit('auth/setUserId', user ? user.uid : null)

  if (!user) {
    return
  }

  if (!user.emailVerified) {
    return pushIfNotAlreadyThere('AuthConfirmSignUp')
  }

  store.dispatch('auth/startFetchingUserInfo')
})

store.watch(state => state.auth.userInfo, userInfo => {
  console.debug('userInfo changed', !!userInfo)

  if (!userInfo) {
    return
  }

  if (userInfo.isAdmin) {
    store.dispatch('data/startFetchingAnomalies')
    store.dispatch('data/startFetchingTypes')
    store.dispatch('data/startFetchingUsers')
    store.dispatch('data/startFetchingNotifications')
  }

  if (router.currentRoute && router.currentRoute.name && router.currentRoute.name.startsWith('Auth')) {
    return pushIfNotAlreadyThere('DashboardHome')
  }
})
