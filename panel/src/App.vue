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
    titleTemplate: 'Rostrenen Et Moi - %s'
  },

  components: {
    AlertSnackbar
  }
}
</script>
