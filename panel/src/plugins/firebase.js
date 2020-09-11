import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import firebaseConfig from './firebase-config'

firebase.initializeApp(firebaseConfig)

const auth = firebase.auth()
auth.languageCode = 'fr'

function getAuthState () {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe()

      resolve(user)
    }, error => {
      unsubscribe()

      reject(error)
    })
  })
}

const firestore = firebase.firestore()
const { Timestamp, GeoPoint, FieldValue } = firebase.firestore

export {
  firebase,
  auth,
  getAuthState,
  firestore,
  Timestamp,
  GeoPoint,
  FieldValue
}
