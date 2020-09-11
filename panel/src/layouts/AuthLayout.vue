<template>
  <v-main>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="10" lg="6">
          <h1 class="text-h5 mb-2 grey--text text--darken-3">Rostrenen et moi</h1>
          <h2 class="text-body-1 mb-8 grey--text text--darken-2">Panel d'administration</h2>

          <RouterView></RouterView>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
export default {
  name: 'AuthLayout'
}
</script>
