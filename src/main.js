import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import 'virtual:uno.css'
import '@unocss/reset/tailwind.css'

const pinia = createPinia()

createApp(App).use(pinia).mount('#app')

import { useBookStore } from './stores/bookStore'

// 在应用挂载后，将 bookStore 实例挂载到 window 对象上
// 使用 setTimeout 确保 Vue 应用完全渲染和 Pinia Store 初始化完成
setTimeout(() => {
  window.bookStore = useBookStore()
  console.log('Pinia bookStore 已挂载到 window.bookStore')
}, 0)
