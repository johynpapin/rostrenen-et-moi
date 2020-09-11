<template>
  <v-main>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="10" lg="6">
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
