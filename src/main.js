import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import './assets/global.css'  // 引入全局样式
import router from './router'  // 引入路由
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'



const app = createApp(App)
app.use(ElementPlus)
app.use(router)  // 使用路由
app.mount('#app')  // 挂载应用