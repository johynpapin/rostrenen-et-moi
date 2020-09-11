import { firestore } from '@/plugins/firebase'

export default {
  async updateIsAdmin (userId, isAdmin) {
    return await firestore.collection('users').doc(userId).update({
      isAdmin
    })
  },

  async createType (type) {
    return await firestore.collection('anomalyTypes').add(type)
  },

  async deleteType (typeId) {
    return await firestore.collection('anomalyTypes').doc(typeId).delete()
  },

  async createNotification (notification) {
    return await firestore.collection('notifications').add(notification)
  },

  async deleteNotification (notificationId) {
    return await firestore.collection('notifications').doc(notificationId).delete()
  }
}
