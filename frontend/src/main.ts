import {createApp} from 'vue'
import App from './App.vue'
import {router} from './router'


const element = document.createElement('div')

element.id = 'app'

document.body.appendChild(element)

const app = createApp(App)

app.use(router)

app.mount(element)
