const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp()

const firestore = admin.firestore()

exports.createUser = functions
  .region('europe-west1')
  .auth
  .user()
  .onCreate(async (user) => {
    await firestore.collection('users').doc(user.uid).set({
      email: user.email,
      createdAt: new Date(user.metadata.creationTime),
      isAdmin: false
    })
  })
