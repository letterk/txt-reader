import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useBookStore } from '../stores/bookStore'
import { getBookById } from '../utils/database'
import { setupKeyboardListener } from '../utils/keyboardHandler'

const LAST_READ_CHAPTERS_KEY = 'lastReadChapters'

function debounce(fn, delay) {
  let timerId
  const debouncedFn = function (...args) {
    clearTimeout(timerId)
    timerId = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
  debouncedFn.cancel = () => {
    clearTimeout(timerId)
  }
  return debouncedFn
}

function saveLastReadChapterToStorage(bookId, chapterId) {
  if (!bookId || chapterId === null || chapterId === undefined) return
  try {
    const allLastRead =
      JSON.parse(localStorage.getItem(LAST_READ_CHAPTERS_KEY)) || {}
    allLastRead[bookId] = chapterId
    localStorage.setItem(LAST_READ_CHAPTERS_KEY, JSON.stringify(allLastRead))
  } catch (e) {
    console.error('保存最后阅读章节失败:', e)
  }
}

function getLastReadChapterFromStorage(bookId) {
  if (!bookId) return undefined
  try {
    const allLastRead =
      JSON.parse(localStorage.getItem(LAST_READ_CHAPTERS_KEY)) || {}
    return allLastRead[bookId]
  } catch (e) {
    console.error('获取最后阅读章节失败:', e)
    return undefined
  }
}

export function useReaderLogic(props) {
  const bookStore = useBookStore()
  const router = useRouter()

  const isLoadingInitial = ref(false)
  const isLoadingMore = ref(false)
  const isSettingsVisible = ref(false)

  const readerContainerRef = ref(null)
  const nextChapterSentinelRef = ref(null)

  let nextChapterObserver = null
  let currentChapterObserver = null

  const debouncedSetCurrentChapterId = debounce((chapterId) => {
    bookStore.setCurrentChapterId(chapterId)
  }, 100)

  const updateRouteAndTitle = async (bookId, chapterId) => {
    let pageTitle = '简单小说阅读器'
    if (bookStore.bookTitle) {
      pageTitle = bookStore.bookTitle
      const currentChapter = bookStore.chapters.find((c) => c.id === chapterId)
      if (currentChapter && currentChapter.title) {
        pageTitle += ` - ${currentChapter.title}`
      }
    }
    document.title = pageTitle
  }

  const scrollToChapterElement = (chapterId, behavior = 'smooth') => {
    nextTick(() => {
      const element = document.getElementById(`chapter-content-${chapterId}`)
      if (element) {
        element.scrollIntoView({ behavior, block: 'start' })
      } else {
        console.warn(
          `Scroll target element chapter-content-${chapterId} not found.`,
        )
      }
    })
  }

  const setupNextChapterObserver = () => {
    if (nextChapterObserver) nextChapterObserver.disconnect()
    if (!nextChapterSentinelRef.value) return

    const options = {
      root: null,
      rootMargin: '0px 0px 300px 0px',
      threshold: [0],
    }

    nextChapterObserver = new IntersectionObserver(async (entries) => {
      const entry = entries[0]
      if (
        entry.isIntersecting &&
        !isLoadingMore.value &&
        bookStore.canLoadMoreChaptersForward
      ) {
        isLoadingMore.value = true
        const lastDisplayedChapter =
          bookStore.displayedChaptersContent.slice(-1)[0]
        if (lastDisplayedChapter) {
          const lastChapterIndexInFullList = bookStore.chapters.findIndex(
            (c) => c.id === lastDisplayedChapter.id,
          )
          if (
            lastChapterIndexInFullList !== -1 &&
            lastChapterIndexInFullList < bookStore.chapters.length - 1
          ) {
            const nextChapterMeta =
              bookStore.chapters[lastChapterIndexInFullList + 1]
            if (nextChapterMeta) {
              bookStore.loadChapterIntoDisplay(nextChapterMeta.id, 'append')
            }
          }
        }
        isLoadingMore.value = false
      }
    }, options)
    nextChapterObserver.observe(nextChapterSentinelRef.value)
  }

  const setupCurrentChapterObserver = () => {
    if (currentChapterObserver) currentChapterObserver.disconnect()
    if (!readerContainerRef.value) return

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: Array.from({ length: 101 }, (_, i) => i / 100),
    }

    currentChapterObserver = new IntersectionObserver((entries) => {
      if (bookStore.navigationSource !== 'scroll') {
        return
      }

      let maxRatio = 0
      let chapterIdWithMaxRatio = null

      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          const chapterElement = entry.target
          const chapterId = parseInt(chapterElement.dataset.chapterId, 10)

          if (!isNaN(chapterId)) {
            maxRatio = entry.intersectionRatio
            chapterIdWithMaxRatio = chapterId
          }
        }
      })

      if (chapterIdWithMaxRatio !== null) {
        debouncedSetCurrentChapterId(chapterIdWithMaxRatio)
      }
    }, options)

    const chapterBlocks =
      readerContainerRef.value.querySelectorAll('.chapter-block')
    chapterBlocks.forEach((el) => {
      currentChapterObserver.observe(el)
    })
  }

  const loadBook = async (bookId) => {
    isLoadingInitial.value = true
    bookStore.clearBookData()

    try {
      const book = await getBookById(bookId)
      if (!book || book.chapters.length === 0) {
        throw new Error(book ? '书籍没有章节数据' : '书籍不存在')
      }

      bookStore.setBookData(book.bookTitle, book.chapters)

      let chapterIdToLoad
      let navigationSourceReason = 'INITIAL_LOAD'

      const lastReadId = getLastReadChapterFromStorage(bookId)
      if (
        lastReadId !== undefined &&
        bookStore.chapters.some((c) => c.id === lastReadId)
      ) {
        chapterIdToLoad = lastReadId
        navigationSourceReason = 'LAST_READ_STORAGE'
      } else {
        chapterIdToLoad = bookStore.chapters[0].id
        navigationSourceReason = 'INITIAL_LOAD_FIRST_CHAPTER'
      }

      bookStore.setNavigationSource(navigationSourceReason)
      bookStore.setCurrentChapterId(chapterIdToLoad)
    } catch (error) {
      console.error('加载书籍失败:', error)
      bookStore.clearBookData()
      router
        .replace({ name: 'Bookshelf' })
        .catch((err) => console.error('导航回书架页失败:', err))
    } finally {
      isLoadingInitial.value = false
    }
  }

  watch(
    () => props.bookId,
    (newBookId) => {
      if (newBookId) {
        loadBook(newBookId)
      }
    },
    { immediate: true },
  )

  watch(
    () => bookStore.currentChapterId,
    async (newId, oldId) => {
      if (newId === null && bookStore.bookTitle) {
        router.replace({ name: 'Bookshelf' })
        return
      }
      if (newId === null || isLoadingInitial.value) return

      if (props.bookId && newId !== oldId) {
        saveLastReadChapterToStorage(props.bookId, newId)
      }

      await updateRouteAndTitle(props.bookId, newId)

      const source = bookStore.navigationSource

      if (
        source === 'INITIAL_LOAD' ||
        source === 'LAST_READ_STORAGE' ||
        source === 'INITIAL_LOAD_FIRST_CHAPTER'
      ) {
        bookStore.loadChapterIntoDisplay(newId, 'replace')
        scrollToChapterElement(newId, 'auto')
      } else if (source === 'TOC_OR_KEYBOARD' || source === 'KEYBOARD') {
        if (!bookStore.displayedChaptersContent.some((c) => c.id === newId)) {
          bookStore.loadChapterIntoDisplay(newId, 'replace')
        }
        scrollToChapterElement(newId, 'smooth')
      }

      if (source !== 'scroll') {
        bookStore.setNavigationSource('scroll')
      }
    },
  )

  watch(
    () => bookStore.displayedChaptersContent.length,
    async () => {
      await nextTick()
      setupCurrentChapterObserver()
      setupNextChapterObserver()
    },
  )

  let cleanupKeyboardListener = null
  onMounted(() => {
    cleanupKeyboardListener = setupKeyboardListener(
      bookStore,
      isLoadingInitial,
      router,
      isSettingsVisible,
    )
    bookStore.isDrawerVisible = false
  })

  onUnmounted(() => {
    cleanupKeyboardListener?.()
    if (nextChapterObserver) nextChapterObserver.disconnect()
    if (currentChapterObserver) currentChapterObserver.disconnect()

    debouncedSetCurrentChapterId.cancel()
  })

  return {
    bookStore,
    isLoadingInitial,
    isLoadingMore,
    readerContainerRef,
    nextChapterSentinelRef,
    isSettingsVisible,
  }
}
