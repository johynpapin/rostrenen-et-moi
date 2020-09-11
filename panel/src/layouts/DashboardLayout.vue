<template>
  <div>
    <v-app-bar
      app
      color="primary"
      dark
      clipped-left
    >
      <v-app-bar-nav-icon
        class="hidden-md-and-up"
        @click="drawer = true"
      ></v-app-bar-nav-icon>

      <v-toolbar-title>Rostrenen et moi</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-menu
        left
        bottom
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            @click="signOut"
          >
            <v-list-item-title>Déconnexion</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
    >
      <v-list dense nav>
        <v-subheader>
          Données
        </v-subheader>

        <v-list-item link :to="{ name: 'DashboardAnomalies' }">
          <v-list-item-icon>
            <v-icon>mdi-alert</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Anomalies</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link :to="{ name: 'DashboardTypes' }">
          <v-list-item-icon>
            <v-icon>mdi-view-list</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Types</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link :to="{ name: 'DashboardUsers' }">
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Utilisateurs</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-subheader>
          Paramètres
        </v-subheader>

        <v-list-item link :to="{ name: 'DashboardNotificationsSettings' }">
          <v-list-item-icon>
            <v-icon>mdi-bell</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Notifications</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <v-row justify="center">
          <v-col cols="12" lg="10">
            <RouterView></RouterView>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </div>
</template>

<script>
export default {
  name: 'DashboardLayout',

  data: () => ({
    drawer: undefined
  }),

  methods: {
    async signOut () {
      await this.$store.dispatch('auth/signOut')
    }
  }
}
</script>
