<template>
  <div>
    <h1 class="text-h4 mb-6">Confirmer votre compte</h1>

    <p class="text-body-1">Pour continuer, vous devez confirmer votre compte. Vous avez dû recevoir un email contenant un lien. Ce lien vous permet de confirmer votre compte.</p>

    <v-row justify="end">
      <v-col cols="12" sm="auto" class="flex-sm-shrink-1">
        <v-btn
          @click="sendVerificationEmail"
          :disabled="sending"
          :loading="sending"
          color="secondary"
          large
          block
        >Renvoyer un email</v-btn>
      </v-col>

      <v-col cols="12" sm="auto" class="flex-sm-shrink-1">
        <v-btn
          :to="{ name: 'AuthSignIn' }"
          color="primary"
          large
          block
        >Connexion</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'ConfirmSignUpView',

  metaInfo: {
    title: 'Confirmer votre compte'
  },

  data: () => ({
    sending: false
  }),

  methods: {
    async sendVerificationEmail () {
      this.sending = true

      try {
        await this.$store.dispatch('auth/sendVerificationEmail')
      } finally {
        this.sending = false
      }
    }
  }
}
</script>
