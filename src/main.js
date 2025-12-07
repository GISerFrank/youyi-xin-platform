import { createApp } from 'vue'
import App from './App.vue'

// 完整引入 Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(ElementPlus) // 全局注册 Element Plus
app.mount('#app')