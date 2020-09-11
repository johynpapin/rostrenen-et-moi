import { firestore } from '@/plugins/firebase'
import { firestoreAction } from 'vuexfire'
import DataService from '@/services/data'

const state = {
  anomalies: [],
  types: [],
  users: [],
  notifications: []
}

const actions = {
  startFetchingAnomalies: firestoreAction(async ({ bindFirestoreRef }) => {
    await bindFirestoreRef('anomalies', firestore.collection('anomalies').orderBy('createdAt', 'desc'))
  }),

  stopFetchingAnomalies: firestoreAction(({ unbindFirestoreRef }) => {
    unbindFirestoreRef('anomalies')
  }),

  startFetchingTypes: firestoreAction(async ({ bindFirestoreRef }) => {
    await bindFirestoreRef('types', firestore.collection('anomalyTypes'))
  }),

  stopFetchingTypes: firestoreAction(({ unbindFirestoreRef }) => {
    unbindFirestoreRef('types')
  }),

  startFetchingUsers: firestoreAction(async ({ bindFirestoreRef }) => {
    await bindFirestoreRef('users', firestore.collection('users'))
  }),

  stopFetchingUsers: firestoreAction(({ unbindFirestoreRef }) => {
    unbindFirestoreRef('users')
  }),

  startFetchingNotifications: firestoreAction(async ({ bindFirestoreRef }) => {
    await bindFirestoreRef('notifications', firestore.collection('notifications'))
  }),

  stopFetchingNotifications: firestoreAction(({ unbindFirestoreRef }) => {
    unbindFirestoreRef('notifications')
  }),

  async updateIsAdmin ({ dispatch }, { userId, isAdmin }) {
    await DataService.updateIsAdmin(userId, isAdmin)

    dispatch('alerts/createAlert', {
      type: 'success',
      message: 'Cet utilisateur a bien été modifié.'
    }, {
      root: true
    })
  },

  async createType ({ dispatch }, type) {
    await DataService.createType(type)

    dispatch('alerts/createAlert', {
      type: 'success',
      message: 'Ce type d\'anomalie a bien été ajouté.'
    }, {
      root: true
    })
  },

  async deleteType ({ dispatch }, { typeId }) {
    await DataService.deleteType(typeId)

    dispatch('alerts/createAlert', {
      type: 'success',
      message: 'Ce type d\'anomalie a bien été supprimé.'
    }, {
      root: true
    })
  },

  async createNotification ({ dispatch }, notification) {
    await DataService.createNotification(notification)

    dispatch('alerts/createAlert', {
      type: 'success',
      message: 'Cette adresse email a bien été ajoutée à la liste des destinataires.'
    }, {
      root: true
    })
  },

  async deleteNotification ({ dispatch }, { notificationId }) {
    await DataService.deleteNotification(notificationId)

    dispatch('alerts/createAlert', {
      type: 'success',
      message: 'Cette adresse email a bien été supprimée à liste des destinataires.'
    }, {
      root: true
    })
  }
}

export default {
  namespaced: true,
  state,
  actions
}
