// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router'

import BookshelfView from '../views/BookshelfView.vue'
import ReaderView from '../views/ReaderView.vue'

const routes = [
  {
    path: '/',
    name: 'Bookshelf',
    component: BookshelfView,
  },
  {
    // 路径为 '/read/:bookId'
    // ':bookId' 是一个动态片段（参数），它会匹配 URL 中的一部分，并作为参数传递给组件
    // 例如，访问 '/read/1'，bookId 就会是 '1'
    path: '/read/:bookId',
    name: 'Reader',
    component: ReaderView,
    // props: true 表示将路由参数（这里是 bookId）作为组件的 props 传递
    // ReaderView 组件就可以通过 props 接收 bookId 了
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
