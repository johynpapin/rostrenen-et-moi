<template>
  <div>
    <h1 class="text-h4 mb-4">Anomalies</h1>

    <v-data-iterator
      :items="anomalies"
    >
      <template v-slot:default="props">
        <v-row>
          <v-col
            v-for="anomaly in props.items"
            :key="anomaly.id"
            cols="12"
            md="6"
            lg="4"
          >
            <v-card>
              <v-card-title>{{ anomaly.typeId }}</v-card-title>

              <v-card-text>
                <p>{{ anomaly.description }}</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'AnomaliesView',

  metaInfo: {
    title: 'Anomalies'
  },

  computed: {
    ...mapState({
      anomalies: state => state.data.anomalies
    })
  }
}
</script>
