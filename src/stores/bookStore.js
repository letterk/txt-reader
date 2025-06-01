import { defineStore } from 'pinia'

export const useBookStore = defineStore('book', {
  state: () => ({
    bookTitle: '',
    chapters: [],
    currentChapterId: null,
    isDrawerVisible: false,
    cachedBookId: null,
    displayedChaptersContent: [],
    navigationSource: 'scroll',
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
        return state.chapters.map((chapter) => ({
          id: chapter.id,
          title: chapter.title,
        }))
      }
      return []
    },
    canLoadMoreChaptersForward: (state) => {
      if (
        state.displayedChaptersContent.length === 0 ||
        state.chapters.length === 0
      ) {
        return false
      }
      const lastDisplayedChapter = state.displayedChaptersContent.slice(-1)[0]
      if (!lastDisplayedChapter) return false
      const lastOverallChapter = state.chapters.slice(-1)[0]
      if (!lastOverallChapter) return false
      return lastDisplayedChapter.id !== lastOverallChapter.id
    },
  },
  actions: {
    setBookData(title, chaptersFromDB, bookId) {
      this.bookTitle = title
      this.chapters = chaptersFromDB.map((ch) => ({ ...ch, bookId }))
      this.cachedBookId = bookId
      this.displayedChaptersContent = []
    },

    _formatChapterForDisplay(chapterData) {
      if (!chapterData || !chapterData.content) return null
      const lines = chapterData.content
        .split('\n')
        .filter((line) => line.trim() !== '')
      const formattedLines = []
      lines.forEach((line) => {
        formattedLines.push({ text: line, isTitle: false })
      })
      return {
        id: chapterData.id,
        title: chapterData.title,
        lines: formattedLines,
        bookId: chapterData.bookId || this.cachedBookId,
      }
    },

    loadChapterIntoDisplay(chapterId, mode = 'replace') {
      const chapterData = this.chapters.find((c) => c.id === chapterId)
      if (!chapterData) {
        console.warn(`Chapter ${chapterId} not found in full chapter list.`)
        return
      }
      const formattedChapter = this._formatChapterForDisplay(chapterData)
      if (!formattedChapter) {
        console.warn(`Failed to format chapter ${chapterId} for display.`)
        return
      }

      if (mode === 'replace') {
        this.displayedChaptersContent = [formattedChapter]
      } else if (mode === 'append') {
        if (!this.displayedChaptersContent.some((c) => c.id === chapterId)) {
          this.displayedChaptersContent.push(formattedChapter)
        }
      }
    },

    setCurrentChapterId(id) {
      if (this.currentChapterId !== id) {
        this.currentChapterId = id
      }
    },

    goToChapterById(chapterId) {
      this.navigationSource = 'TOC_OR_KEYBOARD'
      this.setCurrentChapterId(chapterId)
    },

    goToPrevChapter() {
      const currentIndex = this.currentChapterIndex
      if (currentIndex > 0) {
        const prevChapterId = this.chapters[currentIndex - 1]?.id
        if (prevChapterId) {
          this.navigationSource = 'KEYBOARD'
          this.setCurrentChapterId(prevChapterId)
        }
      }
    },

    goToNextChapter() {
      const currentIndex = this.currentChapterIndex
      if (currentIndex !== -1 && currentIndex < this.chapters.length - 1) {
        const nextChapterId = this.chapters[currentIndex + 1]?.id
        if (nextChapterId) {
          this.navigationSource = 'KEYBOARD'
          this.setCurrentChapterId(nextChapterId)
        }
      }
    },

    setNavigationSource(source) {
      this.navigationSource = source
    },

    toggleDrawer() {
      this.isDrawerVisible = !this.isDrawerVisible
    },

    clearCache() {
      this.bookTitle = ''
      this.chapters = []
      this.currentChapterId = null
      this.cachedBookId = null
      this.displayedChaptersContent = []
      this.navigationSource = 'scroll'
    },
  },
})
