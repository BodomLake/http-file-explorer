import {createApp} from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'

// app的实例化
const app = createApp(App)
// 安装 pinia
app.use(createPinia())
// 挂载到 #app的DOM上面
app.mount('#app')
