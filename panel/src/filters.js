import Vue from 'vue'

import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

Vue.filter('formatDate', function (value) {
  if (!value) return ''

  return format(value, 'PPPP', {
    locale: fr
  })
})
