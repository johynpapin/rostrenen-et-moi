const ALERT_DURATION_MS = 5000

const errors = {
  'auth/email-already-in-use': 'Cette adresse email est déjà utilisée.',
  'auth/invalid-email': 'Cette adresse email est invalide.',
  'auth/user-disabled': 'Votre compte a été désactivé.',
  'auth/user-not-found': 'Aucun utilisateur ne correspond à cette adresse email.',
  'auth/wrong-password': 'Mauvais mot de passe.',
  'auth/weak-password': 'Ce mot de passe est trop faible.',
  'auth/too-many-requests': 'Trop de requêtes, veuillez réessayer plus tard.'
}

function messageFromErrorCode (errorCode) {
  const message = errors[errorCode]

  if (message) {
    return message
  }

  return 'Une erreur est survenue, veuillez réessayer.'
}

const state = () => ({
  alert: null,
  timeoutId: null
})

const mutations = {
  setAlert (state, alert) {
    state.alert = alert
  },

  setTimeoutId (state, timeoutId) {
    state.timeoutId = timeoutId
  }
}

const actions = {
  async createAlert ({ commit, state }, alert) {
    if (state.timeoutId !== null) {
      clearTimeout(state.timeoutId)
      commit('setTimeoutId', null)
    }

    commit('setAlert', alert)

    commit('setTimeoutId', setTimeout(() => {
      commit('setAlert', null)
      commit('setTimeoutId', null)
    }, ALERT_DURATION_MS))
  },

  async createAlertFromErrorCode ({ dispatch }, errorCode) {
    await dispatch('createAlert', {
      type: 'error',
      message: messageFromErrorCode(errorCode)
    })
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
