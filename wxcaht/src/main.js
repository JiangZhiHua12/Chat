import { createApp } from 'vue'
import App from './App.vue'
import Axios from 'axios'


Axios.defaults.baseURL='/api'
Axios.defaults.headers.post['Content-Type']='application//json'


createApp(App).mount('#app')


