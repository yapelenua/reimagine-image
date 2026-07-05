import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import './assets/base.css'

import App from './App.vue'
import router from './router'

const vuetify = createVuetify({
  components,
  directives,
  icons: { defaultSet: 'mdi' },
  theme: {
    defaultTheme: 'dark',
    themes: {
      light: { dark: false, colors: {} },
      dark:  { dark: true,  colors: {} },
    },
  },
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(vuetify)
app.mount('#app')
