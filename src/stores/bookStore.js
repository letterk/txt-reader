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
  getters: {
    // 获取当前正在阅读的章节对象
    currentChapter: (state) => {
      // 确保 chapters 数组存在且索引有效
      if (
        state.chapters.length > 0 &&
        state.currentChapterIndex >= 0 &&
        state.currentChapterIndex < state.chapters.length
      ) {
        return state.chapters[state.currentChapterIndex]
      }
      return null // 如果没有章节或索引无效，返回 null
    },

    // 获取当前章节的纯文本内容
    currentChapterContent: (state) => {
      // 通过 currentChapter getter 获取当前章节对象，然后返回其 content
      // 注意：getter 中可以调用其他 getter (通过 this)，但这里直接访问 state 更简洁
      const current = state.chapters[state.currentChapterIndex]
      return current ? current.content : '' // 如果没有当前章节，返回空字符串
    },

    // 判断当前是否是第一章
    isFirstChapter: (state) => {
      // 只有当 chapters 数组不为空且当前索引为 0 时，才是第一章
      return state.chapters.length > 0 && state.currentChapterIndex === 0
    },

    // 判断当前是否是最后一章
    isLastChapter: (state) => {
      // 只有当 chapters 数组不为空且当前索引为数组的最后一个索引时，才是最后一章
      return (
        state.chapters.length > 0 &&
        state.currentChapterIndex === state.chapters.length - 1
      )
    },

    // 获取用于目录导航的章节列表 (只包含 id 和 title)
    chaptersListForNav: (state) => {
      // 遍历 chapters 数组，为每个章节创建一个包含 id 和 title 的新对象
      return state.chapters.map((chapter, index) => ({
        id: chapter.id !== undefined ? chapter.id : index, // 使用章节自己的id，如果没有则使用索引
        title: chapter.title,
        index: index, // 同时保存索引，方便跳转
      }))
    },
  },

  // actions 是方法，用于修改 state 或执行异步操作
  actions: {},
})
