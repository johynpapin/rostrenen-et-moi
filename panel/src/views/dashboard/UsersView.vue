<template>
  <div>
    <h1 class="text-h4 mb-4">Utilisateurs</h1>

    <v-data-table
      :headers="headers"
      :items="users"
      sortBy="createdAt"
    >
      <template v-slot:item.createdAt="{ item }">
        {{ item.createdAt | formatDate }}
      </template>

      <template v-slot:item.isAdmin="{ item }">
        <v-switch
          :input-value="item.isAdmin"
          :disabled="updating.includes(item.id)"
          :loading="updating.includes(item.id)"
          @change="updateIsAdmin(item)"
        ></v-switch>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: 'UsersView',

  metaInfo: {
    title: 'Utilisateurs'
  },

  data: () => ({
    updating: [],
    headers: [
      {
        text: 'Adresse email',
        value: 'email'
      },
      {
        text: 'Créé le',
        value: 'createdAt'
      },
      {
        text: 'Administrateur',
        value: 'isAdmin'
      }
    ]
  }),

  computed: {
    users () {
      return this.$store.state.data.users.map(user => ({
        id: user.id,
        email: user.email,
        createdAt: user.createdAt.toDate(),
        isAdmin: user.isAdmin
      }))
    }
  },

  methods: {
    async updateIsAdmin (user) {
      this.updating.push(user.id)

      try {
        await this.$store.dispatch('data/updateIsAdmin', {
          userId: user.id,
          isAdmin: !user.isAdmin
        })
      } finally {
        this.updating = this.updating.filter(userId => userId !== user.id)
      }
    }
  }
}
</script>
