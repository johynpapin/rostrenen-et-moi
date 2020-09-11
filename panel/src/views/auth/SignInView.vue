<template>
  <div>
    <h1 class="text-h4 mb-8">Connexion</h1>

    <ValidationObserver v-slot="{ handleSubmit, invalid }">
      <form @submit.prevent="handleSubmit(signIn)">
        <ValidationProvider rules="required|email" name="Adresse email" v-slot="{ errors }">
          <v-text-field
            v-model="email"
            :error-messages="errors"
            type="email"
            label="Adresse email"
            outlined
          ></v-text-field>
        </ValidationProvider>

        <ValidationProvider rules="required" name="Mot de passe" v-slot="{ errors }">
          <v-text-field
            v-model="password"
            :error-messages="errors"
            type="password"
            label="Mot de passe"
            outlined
          ></v-text-field>
        </ValidationProvider>

        <v-row justify="end" no-gutters>
          <v-col cols="12" sm="auto" class="flex-sm-shrink-1">
            <v-btn
              :disabled="invalid || submitting"
              :loading="submitting"
              type="submit"
              color="primary"
              large
              block
            >Envoyer</v-btn>
          </v-col>
        </v-row>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { ValidationObserver, ValidationProvider } from 'vee-validate'

export default {
  name: 'SignInView',

  metaInfo: {
    title: 'Connexion'
  },

  data: () => ({
    email: '',
    password: '',
    submitting: false
  }),

  computed: {
    ...mapState({
      userInfo: state => state.auth.userInfo
    })
  },

  watch: {
    userInfo (value) {
      if (!value && this.submitting) {
        this.submitting = false
      }
    }
  },

  methods: {
    async signIn () {
      this.submitting = true

      const user = {
        email: this.email,
        password: this.password
      }

      try {
        await this.$store.dispatch('auth/signIn', user)
      } catch (error) {
        this.submitting = false
      }
    }
  },

  components: {
    ValidationObserver,
    ValidationProvider
  }
}
</script>
