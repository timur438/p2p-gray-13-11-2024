import {createApp} from 'vue'
import {Quasar} from 'quasar'
import {router} from '@/router.ts'
import App from '@/App.vue'

const app = createApp(App)

app.use(Quasar, {
  config: {
    dark: true,
  },
})

app.use(router)

const el = document.createElement('div')

document.body.appendChild(el)

app.mount(el)
