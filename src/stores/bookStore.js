import { defineStore } from 'pinia'

export const useBookStore = defineStore('book', {
  state: () => ({
    bookTitle: '',
    chapters: [],
    currentChapterIndex: 0,
    isDrawerVisible: false,
    isLoading: false,
  }),
  getters: {
    currentChapter: (state) => {
      if (
        state.chapters.length > 0 &&
        state.currentChapterIndex >= 0 &&
        state.currentChapterIndex < state.chapters.length
      ) {
        return state.chapters[state.currentChapterIndex]
      }
      return null
    },
    isFirstChapter: (state) => {
      return state.chapters.length > 0 && state.currentChapterIndex === 0
    },
    isLastChapter: (state) => {
      return (
        state.chapters.length > 0 &&
        state.currentChapterIndex === state.chapters.length - 1
      )
    },
    chaptersListForNav: (state) => {
      return state.chapters.map((chapter, index) => ({
        id: chapter.id !== undefined ? chapter.id : index,
        title: chapter.title,
        index: index,
      }))
    },
    currentChapterLines: (state) => {
      const content = state.chapters[state.currentChapterIndex]?.content || ''
      return content
        ? content.split('\n').filter((line) => line.trim() !== '')
        : []
    },
  },
  actions: {
    setBookData(title, chapters) {
      this.bookTitle = title
      this.chapters = chapters

      this.currentChapterIndex = 0
    },

    goToChapter(index) {
      if (index >= 0 && index < this.chapters.length) {
        this.currentChapterIndex = index
      }
    },
    goToPrevChapter() {
      if (!this.isFirstChapter) {
        this.goToChapter(this.currentChapterIndex - 1)
      }
    },
    goToNextChapter() {
      if (!this.isLastChapter) {
        this.goToChapter(this.currentChapterIndex + 1)
      }
    },

    toggleDrawer() {
      this.isDrawerVisible = !this.isDrawerVisible
    },

    setLoading(isLoading) {
      this.isLoading = isLoading
    },
  },
})
