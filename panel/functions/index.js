const functions = require('firebase-functions')
const logger = require('firebase-functions/lib/logger')
const admin = require('firebase-admin')
const { v4: uuidv4 } = require('uuid')

admin.initializeApp()

const firestore = admin.firestore()
const storageBucket = admin.storage().bucket()

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

exports.updateAnomalyImages = functions
  .region('europe-west1')
  .firestore
  .document('/anomalies/{anomalyId}')
  .onCreate(async (snapshot, context) => {
    const anomaly = snapshot.data()

    if (!anomaly.imagesUploadFolder) {
      return
    }

    const [files] = await storageBucket.getFiles({
      prefix: `tmp/${anomaly.userId}/${anomaly.imagesUploadFolder}/`,
      delimiter: '/'
    })

    logger.log({
      files
    })

    const images = []

    for (const file of files) {
      const imageId = uuidv4()

      logger.log('Moving file', {
        file,
        imageId,
        anomaly
      })

      await file.move(storageBucket.file(`images/${anomaly.userId}/${imageId}`))

      images.push({
        id: imageId
      })
    }

    await snapshot.ref.update({
      imagesUploadFolder: admin.firestore.FieldValue.delete(),
      images
    })
  })
