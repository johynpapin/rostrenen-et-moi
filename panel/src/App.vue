<template>
  <v-app>
    <RouterView></RouterView>

    <AlertSnackbar></AlertSnackbar>
  </v-app>
</template>

<script>
import AlertSnackbar from './components/AlertSnackbar'

export default {
  name: 'App',

  metaInfo: {
    title: 'Panel d\'administration',
    titleTemplate: 'Rostrenen et moi - %s'
  },

  components: {
    AlertSnackbar
  }
}
</script>
