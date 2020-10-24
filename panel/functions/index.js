const functions = require('firebase-functions')
const logger = require('firebase-functions/lib/logger')
const admin = require('firebase-admin')
const { v4: uuidv4 } = require('uuid')
const nodemailer = require('nodemailer')

admin.initializeApp()

const config = functions.config()
const firestore = admin.firestore()
const storageBucket = admin.storage().bucket()

const transporter = nodemailer.createTransport(config.email.connection.url)

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

		const images = await Promise.all(files.map(async file => {
			const imageId = uuidv4() 
			await file.move(storageBucket.file(`images/${anomaly.userId}/${imageId}`))

			return {
        id: imageId
      }
		}))

    await snapshot.ref.update({
      imagesUploadFolder: admin.firestore.FieldValue.delete(),
      images
    })
  })

exports.sendEmailOnAnomalyCreated = functions
  .region('europe-west1')
  .firestore
  .document('/anomalies/{anomalyId}')
  .onCreate(async (snapshot, context) => {
    const notifications = (await firestore.collection('settings').doc('notifications').get()).data()
    const emailAddresses = notifications.emailAddresses

    if (!emailAddresses) {
      logger.log('The list of email addresses is empty, nothing to do.')
      return
    }

    logger.log(`Sending ${emailAddresses.length} emails.`)

    await Promise.all(emailAddresses.map(to => transporter.sendMail({
      from: config.email.from,
      to,
      subject: 'Rostrenen et moi - Nouvelle anomalie',
      text: 'Une nouvelle anomalie a été mise en ligne sur Rostrenen et moi.'
    })))
})

