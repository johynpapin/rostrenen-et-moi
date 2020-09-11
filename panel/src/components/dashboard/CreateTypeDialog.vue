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
      <v-card-title class="mb-4">Ajouter un type d'anomalie</v-card-title>

      <ValidationObserver v-slot="{ handleSubmit, invalid }" ref="form">
        <form @submit.prevent="handleSubmit(createType)">
          <v-card-text>
            <ValidationProvider name="Nom" rules="required" v-slot="{ errors }">
              <v-text-field
                v-model="name"
                :error-messages="errors"
                type="name"
                label="Nom"
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
  name: 'CreateTypeDialog',

  data: () => ({
    dialog: false,
    submitting: false,
    name: ''
  }),

  methods: {
    close () {
      this.dialog = false
      this.name = ''

      this.$nextTick(() => {
        this.$refs.form.reset()
      })
    },

    async createType () {
      this.submitting = true

      try {
        const type = {
          name: this.name
        }

        await this.$store.dispatch('data/createType', type)
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
