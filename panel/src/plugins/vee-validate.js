import { configure, extend, setInteractionMode } from 'vee-validate'
import { required, email } from 'vee-validate/dist/rules'

setInteractionMode('aggressive')

configure({})

extend('required', required)
extend('email', email)
