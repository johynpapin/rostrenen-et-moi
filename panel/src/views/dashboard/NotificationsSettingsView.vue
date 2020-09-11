<template>
  <div>
    <h1 class="text-h4 mb-4">Paramètres des notifications</h1>

    <h2 class="text-h5 mb-4">Destinataires</h2>
    <p class="text-body-1">Toutes les personnes listées ici recevront un email quand une nouvelle anomalie est signalée.</p>

    <v-data-table
      :headers="headers"
      :items="notifications"
      sortBy="email"
    >
      <template v-slot:item.actions="{ item }">
        <v-btn
          @click="deleteNotification(item)"
          color="error"
          small
          outlined
        >
          <v-icon>mdi-delete</v-icon> Supprimer
        </v-btn>
      </template>
    </v-data-table>

    <CreateNotificationDialog></CreateNotificationDialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CreateNotificationDialog from '@/components/dashboard/CreateNotificationDialog'

export default {
  name: 'TypesView',

  metaInfo: {
    title: 'Paramètres des notifications'
  },

  data: () => ({
    headers: [
      {
        text: 'Adresse email',
        value: 'email'
      },
      {
        text: 'Actions',
        value: 'actions',
        sortable: false,
        width: 'shrink'
      }
    ]
  }),

  computed: {
    ...mapState({
      notifications: state => state.data.notifications
    })
  },

  methods: {
    async deleteNotification (notification) {
      await this.$store.dispatch('data/deleteNotification', {
        notificationId: notification.id
      })
    }
  },

  components: {
    CreateNotificationDialog
  }
}
</script>
