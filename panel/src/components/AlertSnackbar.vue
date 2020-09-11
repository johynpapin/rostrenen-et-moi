<template>
  <v-snackbar app :color="color" :value="alert !== null" timeout="-1">
    {{ alert ? alert.message : '' }}
  </v-snackbar>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'AlertSnackbar',

  computed: {
    ...mapState({
      alert: state => state.alerts.alert
    }),

    color () {
      if (this.alert === null) {
        return undefined
      }

      if (this.alert.type === 'success') {
        return 'success'
      }

      if (this.alert.type === 'error') {
        return 'error'
      }

      return undefined
    }
  }
}
</script>
