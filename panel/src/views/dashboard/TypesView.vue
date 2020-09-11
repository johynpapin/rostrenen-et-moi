<template>
  <div>
    <h1 class="text-h4 mb-4">Types d'anomalies</h1>

    <v-data-table
      :headers="headers"
      :items="types"
      sortBy="name"
    >
      <template v-slot:item.actions="{ item }">
        <v-btn
          @click="deleteType(item)"
          color="error"
          small
          outlined
        >
          <v-icon>mdi-delete</v-icon> Supprimer
        </v-btn>
      </template>
    </v-data-table>

    <CreateTypeDialog></CreateTypeDialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CreateTypeDialog from '@/components/dashboard/CreateTypeDialog'

export default {
  name: 'TypesView',

  metaInfo: {
    title: 'Types d\'anomalies'
  },

  data: () => ({
    headers: [
      {
        text: 'Nom',
        value: 'name'
      },
      {
        text: 'Actions',
        value: 'actions'
      }
    ]
  }),

  computed: {
    ...mapState({
      types: state => state.data.types
    })
  },

  methods: {
    async deleteType (type) {
      await this.$store.dispatch('data/deleteType', {
        typeId: type.id
      })
    }
  },

  components: {
    CreateTypeDialog
  }
}
</script>
