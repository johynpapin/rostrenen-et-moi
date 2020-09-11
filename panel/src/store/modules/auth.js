import AuthService from '@/services/auth'
import { firestore } from '@/plugins/firebase'
import { firestoreAction } from 'vuexfire'

const state = {
  isAuthenticated: false,
  userId: null,
  userInfo: null
}

const mutations = {
  setIsAuthenticated (state, isAuthenticated) {
    state.isAuthenticated = isAuthenticated
  },

  setUserId (state, userId) {
    state.userId = userId
  }
}

const actions = {
  async signIn ({ dispatch }, { email, password }) {
    await AuthService.signIn(email, password)

    dispatch('alerts/createAlert', {
      type: 'success',
      message: 'Vous êtes bien connecté.'
    }, {
      root: true
    })
  },

  async signOut ({ dispatch }) {
    await AuthService.signOut()

    dispatch('alerts/createAlert', {
      type: 'success',
      message: 'Vous êtes bien déconnecté.'
    }, {
      root: true
    })
  },

  async sendVerificationEmail ({ dispatch }) {
    await AuthService.sendVerificationEmail()

    dispatch('alerts/createAlert', {
      type: 'success',
      message: 'Un email vient d\'être envoyé.'
    }, {
      root: true
    })
  },

  startFetchingUserInfo: firestoreAction(async ({ state, bindFirestoreRef }) => {
    if (state.userInfo) {
      return
    }

    await bindFirestoreRef('userInfo', firestore.collection('users').doc(state.userId))
  }),

  stopFetchingUserInfo: firestoreAction(({ unbindFirestoreRef }) => {
    unbindFirestoreRef('userInfo')
  })
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
