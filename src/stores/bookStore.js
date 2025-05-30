import { defineStore } from 'pinia'

export const useBookStore = defineStore('book', {
  state: () => ({
    bookTitle: '',
    chapters: [],
    currentChapterId: null,
    isDrawerVisible: false,
  }),
  getters: {
    currentChapter: (state) => {
      if (state.chapters.length > 0 && state.currentChapterId !== null) {
        const chapter = state.chapters.find(
          (c) => c.id === state.currentChapterId,
        )
        return chapter || null
      }
      return null
    },

    currentChapterIndex: (state) => {
      if (state.chapters.length > 0 && state.currentChapterId !== null) {
        const index = state.chapters.findIndex(
          (c) => c.id === state.currentChapterId,
        )
        return index
      }
      return -1
    },

    isFirstChapter: (state) => {
      const currentIndex = state.currentChapterIndex
      return state.chapters.length > 0 && currentIndex === 0
    },

    isLastChapter: (state) => {
      const currentIndex = state.currentChapterIndex
      return (
        state.chapters.length > 0 &&
        currentIndex !== -1 &&
        currentIndex === state.chapters.length - 1
      )
    },

    chaptersListForNav: (state) => {
      if (state.chapters.length > 0) {
        const bookId = state.chapters[0]?.bookId
        return state.chapters.map((chapter) => ({
          id: chapter.id,
          title: chapter.title,
          bookId: bookId,
        }))
      }
      return []
    },

    currentChapterLines: (state) => {
      const content = state.currentChapter?.content || ''

      return content
        ? content.split('\n').filter((line) => line.trim() !== '')
        : []
    },
  },
  actions: {
    setBookData(title, chapters) {
      this.bookTitle = title
      this.chapters = chapters

      this.currentChapterId = chapters.length > 0 ? chapters[0].id : null

      this.isDrawerVisible = false
    },

    goToChapterById(chapterId) {
      const index = this.chapters.findIndex((c) => c.id === chapterId)

      if (
        index !== -1 &&
        this.bookTitle &&
        this.currentChapterId !== chapterId
      ) {
        this.currentChapterId = chapterId
      } else if (index === -1) {
        console.warn('尝试跳转到不存在的章节 ID:', chapterId)
      }
    },

    goToChapter(index) {
      if (index >= 0 && index < this.chapters.length && this.bookTitle) {
        const targetChapter = this.chapters[index]

        if (targetChapter && targetChapter.id !== this.currentChapterId) {
          this.goToChapterById(targetChapter.id)
        }
      } else {
        console.warn('尝试跳转到无效的章节索引:', index)
      }
    },

    goToPrevChapter() {
      const currentIndex = this.currentChapterIndex

      if (currentIndex > 0) {
        const prevChapterId = this.chapters[currentIndex - 1]?.id

        if (prevChapterId) {
          this.goToChapterById(prevChapterId)
        }
      } else {
        console.log('已经在第一章了。')
      }
    },

    goToNextChapter() {
      const currentIndex = this.currentChapterIndex

      if (currentIndex !== -1 && currentIndex < this.chapters.length - 1) {
        const nextChapterId = this.chapters[currentIndex + 1]?.id

        if (nextChapterId) {
          this.goToChapterById(nextChapterId)
        }
      } else {
        console.log('已经在最后一章了。')
      }
    },

    toggleDrawer() {
      this.isDrawerVisible = !this.isDrawerVisible
    },
  },
})
