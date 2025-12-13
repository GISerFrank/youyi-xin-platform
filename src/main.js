import { createApp } from 'vue'
import App from './App.vue'

// 完整引入 Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 引入自定义样式
import '@/assets/main.css'

const app = createApp(App)

app.use(ElementPlus)
app.mount('#app')
