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
    path: '/read/:bookId/:chapterId?',
    name: 'Reader',
    component: ReaderView,
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
