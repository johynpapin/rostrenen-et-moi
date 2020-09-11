<template>
  <v-dialog
    v-model="dialog"
    max-width="500"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-on="on" v-bind="attrs" fab dark color="primary" fixed bottom right>
        <v-icon dark>mdi-plus</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="mb-4">Ajouter une adresse email</v-card-title>

      <ValidationObserver v-slot="{ handleSubmit, invalid }" ref="form">
        <form @submit.prevent="handleSubmit(createNotification)">
          <v-card-text>
            <ValidationProvider name="Adresse email" rules="required|email" v-slot="{ errors }">
              <v-text-field
                v-model="email"
                :error-messages="errors"
                type="email"
                label="Adresse email"
                outlined
              ></v-text-field>
            </ValidationProvider>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              :disabled="submitting"
              @click="close"
              color="secondary"
              text
            >Annuler</v-btn>

            <v-btn
              :disabled="invalid || submitting"
              :loading="submitting"
              type="submit"
              color="primary"
              text
            >Ajouter</v-btn>
          </v-card-actions>
        </form>
      </ValidationObserver>
    </v-card>
  </v-dialog>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'

export default {
  name: 'CreateNotificationDialog',

  data: () => ({
    dialog: false,
    submitting: false,
    email: ''
  }),

  methods: {
    close () {
      this.dialog = false
      this.email = ''

      this.$nextTick(() => {
        this.$refs.form.reset()
      })
    },

    async createNotification () {
      this.submitting = true

      try {
        const notification = {
          email: this.email
        }

        await this.$store.dispatch('data/createNotification', notification)
        this.close()
      } finally {
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
