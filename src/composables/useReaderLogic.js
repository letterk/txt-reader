import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookStore } from '../stores/bookStore'
import { getBookById } from '../utils/database'
import { setupKeyboardListener } from '../utils/keyboardHandler'

export function useReaderLogic(props) {
  const bookStore = useBookStore()
  const route = useRoute()
  const router = useRouter()
  const isLoading = ref(false)

  const updateRoute = (bookId, chapterId) => {
    if (
      route.params.bookId !== bookId ||
      route.params.chapterId !== chapterId.toString()
    ) {
      router
        .replace({
          name: 'Reader',
          params: { bookId, chapterId: chapterId.toString() },
        })
        .catch((err) => console.error('更新路由失败:', err))
    }
  }

  const loadBook = async (id, targetChapterIdStr) => {
    const targetChapterId = targetChapterIdStr
      ? parseInt(targetChapterIdStr, 10)
      : undefined

    if (bookStore.cachedBookId === id) {
      if (
        targetChapterId !== undefined &&
        targetChapterId !== bookStore.currentChapterId
      ) {
        const targetChapter = bookStore.chapters.find(
          (c) => c.id === targetChapterId,
        )
        if (targetChapter) {
          bookStore.goToChapterById(targetChapterId)
          updateRoute(id, targetChapterId)
        } else {
          console.warn(`章节 ID ${targetChapterId} 不存在，跳转到第一章`)
          bookStore.goToChapterById(bookStore.chapters[0].id)
          updateRoute(id, bookStore.chapters[0].id)
        }
      } else if (bookStore.currentChapterId) {
        updateRoute(id, bookStore.currentChapterId)
      }
      return
    }

    isLoading.value = true
    try {
      const book = await getBookById(id)

      if (!book || book.chapters.length === 0) {
        throw new Error(book ? '书籍没有章节数据' : '书籍不存在')
      }

      const chaptersWithBookId = book.chapters.map((chapter) => ({
        ...chapter,
        bookId: book.id,
      }))

      bookStore.setBookData(book.bookTitle, chaptersWithBookId)
      bookStore.cachedBookId = id

      let chapterIdToLoad = targetChapterId

      if (
        chapterIdToLoad === undefined ||
        !chaptersWithBookId.some((c) => c.id === chapterIdToLoad)
      ) {
        chapterIdToLoad = chaptersWithBookId[0].id
        if (targetChapterId !== undefined) {
          console.warn(`指定章节 ${targetChapterId} 不存在，跳转到第一章`)
        }
      }

      bookStore.goToChapterById(chapterIdToLoad)

      updateRoute(id, chapterIdToLoad)
    } catch (error) {
      console.error('加载书籍失败:', error)
      bookStore.clearCache()

      router.replace({ name: 'Bookshelf' }).catch((err) => {
        console.error('导航回书架页失败:', err)
      })
    } finally {
      isLoading.value = false
    }
  }

  watch(
    () => props.bookId,
    (newId) => newId && loadBook(newId, props.chapterId),
    { immediate: true },
  )

  watch(
    () => props.chapterId,
    (newId) => {
      if (newId !== undefined && newId !== null && bookStore.bookTitle) {
        const targetChapterId = parseInt(newId, 10)
        const targetChapter = bookStore.chapters.find(
          (c) => c.id === targetChapterId,
        )
        if (targetChapter) {
          bookStore.goToChapterById(targetChapterId)
        } else {
          console.warn(`Props 中的章节 ID ${newId} 在当前书籍中不存在。`)
        }
      }
    },
  )

  watch(
    () => bookStore.currentChapterId,
    (newId, oldId) => {
      if (
        newId !== oldId &&
        newId !== null &&
        bookStore.chapters.length > 0 &&
        !isLoading.value
      ) {
        const currentChapter = bookStore.chapters.find((c) => c.id === newId)
        if (currentChapter) {
          updateRoute(currentChapter.bookId, newId)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        } else {
          console.error(
            `Store 中的 currentChapterId ${newId} 不存在于当前章节列表中。`,
          )
          bookStore.clearCache()
          router.replace({ name: 'Bookshelf' })
        }
      } else if (newId === null && oldId !== null) {
        console.log('书籍缓存被清空，导航回书架页。')
        router.replace({ name: 'Bookshelf' })
      }
    },
  )

  let cleanupKeyboardListener = null

  onMounted(() => {
    cleanupKeyboardListener = setupKeyboardListener(
      bookStore,
      isLoading,
      router,
    )
    bookStore.isDrawerVisible = false
  })

  onUnmounted(() => {
    cleanupKeyboardListener?.()
  })

  return {
    bookStore,
    isLoading,
  }
}
