import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import App from './App.vue'
import 'virtual:uno.css'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify()
const pinia = createPinia()

createApp(App).use(pinia).use(vuetify).mount('#app')
