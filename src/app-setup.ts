import { createApp } from 'vue'
import App from './App.vue'

const setup = () => {
  const app = createApp(App)
  app.mount(document.body)
}

export default setup
