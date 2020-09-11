import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyCIXiusoOXXsbzFHULlEF4ADrTIvV24DLY',
  authDomain: 'rostrenen-et-moi.firebaseapp.com',
  databaseURL: 'https://rostrenen-et-moi.firebaseio.com',
  projectId: 'rostrenen-et-moi',
  storageBucket: 'rostrenen-et-moi.appspot.com',
  messagingSenderId: '398521852046',
  appId: '1:398521852046:web:1f5a10044783c9c2ffa9df'
}

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
