import { defineStore } from 'pinia'

// 使用 defineStore 定义并导出我们的 store
// 'book' 是这个 store 的唯一 ID
export const useBookStore = defineStore('book', {
  // state 是一个函数，返回 store 的初始状态
  state: () => ({}),

  // getters 是计算属性，用于从 state 中派生状态
  getters: {},

  // actions 是方法，用于修改 state 或执行异步操作
  actions: {},
})
