import { defineStore } from 'pinia'

// 使用 defineStore 定义并导出我们的 store
// 'book' 是这个 store 的唯一 ID
export const useBookStore = defineStore('book', {
  // state 是一个函数，返回 store 的初始状态
  state: () => ({
    // 存储书籍的标题
    bookTitle: '',
    // 存储解析后的章节数组，每个元素是一个章节对象
    // { id: number, title: string, content: string }
    chapters: [],
    // 当前正在阅读的章节在 chapters 数组中的索引
    currentChapterIndex: 0,
    // 控制目录抽屉的显示/隐藏
    isDrawerVisible: false,
    // 表示文件是否正在加载和解析中
    isLoading: false,
    // 可选：存储当前章节在虚拟列表中的滚动位置，用于返回时恢复
    // currentScrollPosition: 0, // 暂时不需要，作为可选功能
  }),

  // getters 是计算属性，用于从 state 中派生状态
  getters: {},

  // actions 是方法，用于修改 state 或执行异步操作
  actions: {},
})
