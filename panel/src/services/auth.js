import { auth } from '@/plugins/firebase'

export default {
  async signIn (email, password) {
    return await auth.signInWithEmailAndPassword(email, password)
  },

  async signOut () {
    return await auth.signOut()
  },

  async sendVerificationEmail () {
    const user = auth.currentUser

    return await user.sendEmailVerification()
  }
}
