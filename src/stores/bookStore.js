import { defineStore } from 'pinia'
import { parseBookText } from './parser'
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
  actions: {
    // 设置书籍的标题和章节数据
    // 这个 action 会在文件解析完成后被调用
    setBookData(title, chapters) {
      this.bookTitle = title
      this.chapters = chapters
      // 加载新书后，默认从第一章开始
      this.currentChapterIndex = 0
      // 可以在这里触发一些副作用，比如通知阅读区域滚动到顶部
    },

    // 跳转到指定的章节索引
    goToChapter(index) {
      // 检查索引是否有效
      if (index >= 0 && index < this.chapters.length) {
        this.currentChapterIndex = index
        // 可能需要在此处或组件中触发虚拟列表的滚动
        // this.currentScrollPosition = 0; // 如果需要重置滚动位置
        console.log(`跳转到章节: ${index}`) // 用于调试
      } else {
        console.warn(`尝试跳转到无效章节索引: ${index}`)
      }
    },

    // 跳转到上一章
    goToPrevChapter() {
      // 使用 getter 判断是否是第一章，如果不是，则 currentChapterIndex 减 1
      if (!this.isFirstChapter) {
        this.goToChapter(this.currentChapterIndex - 1)
      }
    },

    // 跳转到下一章
    goToNextChapter() {
      // 使用 getter 判断是否是最后一章，如果不是，则 currentChapterIndex 加 1
      if (!this.isLastChapter) {
        this.goToChapter(this.currentChapterIndex + 1)
      }
    },

    // 切换目录抽屉的显示状态
    toggleDrawer() {
      this.isDrawerVisible = !this.isDrawerVisible
    },

    // 设置加载状态
    setLoading(isLoading) {
      this.isLoading = isLoading
    },

    // 异步 action，用于加载和解析小说文件
    async loadBook(file) {
      // 1. 设置加载状态为 true
      this.setLoading(true)
      this.setBookData('', []) // 清空之前的数据

      try {
        // 2. 使用 FileReader 读取文件内容
        const reader = new FileReader()

        // 将文件读取操作包装在一个 Promise 中，以便在 async/await 中使用
        const fileContent = await new Promise((resolve, reject) => {
          reader.onload = (event) => {
            // 读取成功，解决 Promise 并返回文件内容
            resolve(event.target.result)
          }
          reader.onerror = (error) => {
            // 读取失败，拒绝 Promise 并返回错误
            reject(error)
          }
          // 以文本形式读取文件，指定编码为 UTF-8 (可以根据需要调整)
          reader.readAsText(file, 'UTF-8')
        })

        // 3. 解析文件内容为章节数据
        // 调用我们单独实现的解析函数
        const chapters = parseBookText(fileContent) // 调用解析函数

        // 4. 更新 store 的状态
        // 从文件名中提取书名
        const bookTitle =
          (file.name.match(/《(.*?)》/) ?? [])[1] ??
          file.name.replace(/\.txt$/, '')

        if (chapters.length === 0) {
          // 如果没有解析到任何章节，可能文件格式不对或者解析规则有问题
          console.warn('未解析到任何章节！')
          this.setBookData('解析失败', []) // 清空数据并显示解析失败
        } else {
          // 更新 store 的状态
          this.setBookData(bookTitle, chapters)
        }
      } catch (error) {
        // 5. 错误处理
        console.error('加载或解析文件失败:', error)
        // 清空数据并显示解析失败
        this.setBookData('加载或解析文件失败', [])
      } finally {
        // 不论成功或失败，最后都要设置 isLoading 为 false
        this.setLoading(false)
      }
    },
  },
})
