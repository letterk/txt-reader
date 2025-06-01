import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useBookStore = defineStore('book', () => {
  // state
  const bookTitle = ref('')
  const chapters = ref([])
  const currentChapterId = ref(null)
  const isDrawerVisible = ref(false)
  const cachedBookId = ref(null)
  const displayedChaptersContent = ref([])
  const navigationSource = ref('scroll')

  // getters
  const currentChapter = computed(() => {
    if (chapters.value.length > 0 && currentChapterId.value !== null) {
      const chapter = chapters.value.find(
        (c) => c.id === currentChapterId.value,
      )
      return chapter || null
    }
    return null
  })

  const currentChapterIndex = computed(() => {
    if (chapters.value.length > 0 && currentChapterId.value !== null) {
      const index = chapters.value.findIndex(
        (c) => c.id === currentChapterId.value,
      )
      return index
    }
    return -1
  })

  const isFirstChapter = computed(() => {
    return chapters.value.length > 0 && currentChapterIndex.value === 0
  })

  const isLastChapter = computed(() => {
    return (
      chapters.value.length > 0 &&
      currentChapterIndex.value !== -1 &&
      currentChapterIndex.value === chapters.value.length - 1
    )
  })

  const chaptersListForNav = computed(() => {
    if (chapters.value.length > 0) {
      return chapters.value.map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
      }))
    }
    return []
  })

  const canLoadMoreChaptersForward = computed(() => {
    if (
      displayedChaptersContent.value.length === 0 ||
      chapters.value.length === 0
    ) {
      return false
    }
    const lastDisplayedChapter = displayedChaptersContent.value.slice(-1)[0]
    if (!lastDisplayedChapter) return false
    const lastOverallChapter = chapters.value.slice(-1)[0]
    if (!lastOverallChapter) return false
    return lastDisplayedChapter.id !== lastOverallChapter.id
  })

  // actions
  function setBookData(title, chaptersFromDB, bookId) {
    bookTitle.value = title
    chapters.value = chaptersFromDB.map((ch) => ({ ...ch, bookId }))
    cachedBookId.value = bookId
    displayedChaptersContent.value = []
  }

  function _formatChapterForDisplay(chapterData) {
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
      bookId: chapterData.bookId || cachedBookId.value,
    }
  }

  function loadChapterIntoDisplay(chapterId, mode = 'replace') {
    const chapterData = chapters.value.find((c) => c.id === chapterId)
    if (!chapterData) {
      console.warn(`Chapter ${chapterId} not found in full chapter list.`)
      return
    }
    const formattedChapter = _formatChapterForDisplay(chapterData)
    if (!formattedChapter) {
      console.warn(`Failed to format chapter ${chapterId} for display.`)
      return
    }

    if (mode === 'replace') {
      displayedChaptersContent.value = [formattedChapter]
    } else if (mode === 'append') {
      if (!displayedChaptersContent.value.some((c) => c.id === chapterId)) {
        displayedChaptersContent.value.push(formattedChapter)
      }
    } else if (mode === 'prepend') {
      if (!displayedChaptersContent.value.some((c) => c.id === chapterId)) {
        displayedChaptersContent.value.unshift(formattedChapter)
      }
    }
  }

  function setCurrentChapterId(id) {
    if (currentChapterId.value !== id) {
      currentChapterId.value = id
    }
  }

  function goToChapterById(chapterId) {
    navigationSource.value = 'TOC_OR_KEYBOARD'
    setCurrentChapterId(chapterId)
  }

  function goToPrevChapter() {
    const currentIndex = currentChapterIndex.value
    if (currentIndex > 0) {
      const prevChapterMeta = chapters.value[currentIndex - 1]
      if (prevChapterMeta) {
        setNavigationSource('KEYBOARD')
        if (
          !displayedChaptersContent.value.some(
            (c) => c.id === prevChapterMeta.id,
          )
        ) {
          const formattedChapter = _formatChapterForDisplay(prevChapterMeta)
          if (formattedChapter) {
            displayedChaptersContent.value.unshift(formattedChapter)
          }
        }
        setCurrentChapterId(prevChapterMeta.id)
      }
    }
  }

  function goToNextChapter() {
    const currentIndex = currentChapterIndex.value
    if (currentIndex !== -1 && currentIndex < chapters.value.length - 1) {
      const nextChapterMeta = chapters.value[currentIndex + 1]
      if (nextChapterMeta) {
        setNavigationSource('KEYBOARD')
        if (
          !displayedChaptersContent.value.some(
            (c) => c.id === nextChapterMeta.id,
          )
        ) {
          const formattedChapter = _formatChapterForDisplay(nextChapterMeta)
          if (formattedChapter) {
            displayedChaptersContent.value.push(formattedChapter)
          }
        }
        setCurrentChapterId(nextChapterMeta.id)
      }
    }
  }

  function setNavigationSource(source) {
    navigationSource.value = source
  }

  function toggleDrawer() {
    isDrawerVisible.value = !isDrawerVisible.value
  }

  function clearCache() {
    bookTitle.value = ''
    chapters.value = []
    currentChapterId.value = null
    cachedBookId.value = null
    displayedChaptersContent.value = []
    navigationSource.value = 'scroll'
  }

  return {
    // state
    bookTitle,
    chapters,
    currentChapterId,
    isDrawerVisible,
    cachedBookId,
    displayedChaptersContent,
    navigationSource,

    // getters
    currentChapter,
    currentChapterIndex,
    isFirstChapter,
    isLastChapter,
    chaptersListForNav,
    canLoadMoreChaptersForward,

    // actions
    setBookData,
    loadChapterIntoDisplay,
    setCurrentChapterId,
    goToChapterById,
    goToPrevChapter,
    goToNextChapter,
    setNavigationSource,
    toggleDrawer,
    clearCache,
  }
})
