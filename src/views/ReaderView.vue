<!-- src/views/ReaderView.vue -->
<template>
  <div class="w-full flex flex-col py-2">
    <h2 class="mb-4 flex-shrink-0 text-center text-4xl font-bold">
      <span v-if="bookStore.isLoading">正在加载书籍...</span>
      <span v-else-if="!bookStore.bookTitle">请选择小说文件</span>
      <span v-else>{{
        bookStore.currentChapter?.title || '章节加载中...'
      }}</span>
    </h2>

    <div
      v-if="!bookStore.bookTitle && !bookStore.isLoading"
      class="text-center text-gray-500"
    >
      请在书架选择一本小说阅读。
    </div>
    <div
      v-else-if="bookStore.bookTitle && !bookStore.isLoading"
      class="text-5 line-height-7"
    >
      <p
        v-for="(line, index) in bookStore.currentChapterLines"
        :key="index"
        class="my-2 indent-lg"
      >
        {{ line }}
      </p>
    </div>
  </div>

  <ReaderNav v-if="bookStore.bookTitle && !bookStore.isLoading" />

  <ReaderToc v-if="bookStore.bookTitle && !bookStore.isLoading" />
</template>

<script setup>
  import { watch, onMounted, onUnmounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useBookStore } from '../stores/bookStore'
  import { getBookById } from '../utils/database'
  import { setupKeyboardListener } from '../utils/keyboardHandler'

  import ReaderNav from '../components/ReaderNav.vue'
  import ReaderToc from '../components/ReaderToc.vue'

  const bookStore = useBookStore()
  const route = useRoute()
  const router = useRouter()

  const props = defineProps({
    bookId: {
      type: String,
      required: true,
    },
    chapterIndex: {
      type: String,
      required: false,
      default: '0',
    },
  })

  const loadBook = async (id) => {
    const bookIdInt = parseInt(id, 10)

    if (
      bookStore.chapters.length > 0 &&
      bookStore.chapters[0]?.bookId === bookIdInt
    ) {
      const initialChapterIndex = parseInt(props.chapterIndex, 10)
      if (
        !isNaN(initialChapterIndex) &&
        initialChapterIndex >= 0 &&
        initialChapterIndex < bookStore.chapters.length
      ) {
        bookStore.goToChapter(initialChapterIndex)

        updateRoute(bookIdInt, initialChapterIndex)
      } else {
        bookStore.goToChapter(0)
        updateRoute(bookIdInt, 0)
      }
      return
    }

    bookStore.setLoading(true)

    try {
      const book = await getBookById(bookIdInt)

      if (book) {
        const chaptersWithBookId = book.chapters.map((chapter) => ({
          ...chapter,
          bookId: book.id,
        }))

        bookStore.setBookData(book.bookTitle, chaptersWithBookId)

        const initialChapterIndex = parseInt(props.chapterIndex, 10)

        const targetChapterIndex =
          !isNaN(initialChapterIndex) &&
          initialChapterIndex >= 0 &&
          initialChapterIndex < book.chapters.length
            ? initialChapterIndex
            : 0

        bookStore.goToChapter(targetChapterIndex)

        updateRoute(book.id, targetChapterIndex)
      } else {
        bookStore.setBookData('', [])
        router.replace({ name: 'Bookshelf' }).catch((err) => {
          console.error('书籍不存在，导航回书架页失败:', err)
        })
      }
    } catch (error) {
      console.error(`加载书籍 ID ${id} 失败:`, error)

      bookStore.setBookData('', [])
      router.replace({ name: 'Bookshelf' }).catch((err) => {
        console.error('加载书籍失败，导航回书架页失败:', err)
      })
    } finally {
      bookStore.setLoading(false)
    }
  }

  const updateRoute = (bookId, chapterIndex) => {
    const currentBookId = route.params.bookId
      ? parseInt(route.params.bookId, 10)
      : undefined
    const currentChapterIndex = route.params.chapterIndex
      ? parseInt(route.params.chapterIndex, 10)
      : undefined

    if (currentBookId !== bookId || currentChapterIndex !== chapterIndex) {
      router
        .replace({
          name: 'Reader',
          params: {
            bookId: bookId,
            chapterIndex: chapterIndex,
          },
        })
        .catch((err) => {
          console.error('更新路由失败:', err)
        })
    }
  }

  let cleanupKeyboardListener = null

  onMounted(() => {
    loadBook(props.bookId)

    cleanupKeyboardListener = setupKeyboardListener(bookStore)

    bookStore.isDrawerVisible = false
  })

  watch(
    () => props.bookId,
    (newBookId, oldBookId) => {
      if (
        newBookId &&
        parseInt(newBookId, 10) !== bookStore.chapters[0]?.bookId
      ) {
        console.log(
          `Book ID changed from ${oldBookId} to ${newBookId}. Reloading book.`,
        )
        loadBook(newBookId)
      }
    },
  )

  watch(
    () => props.chapterIndex,
    (newChapterIndexStr, oldChapterIndexStr) => {
      const newIndex = parseInt(newChapterIndexStr, 10)
      const oldIndex = parseInt(oldChapterIndexStr, 10)

      if (
        !isNaN(newIndex) &&
        newIndex !== bookStore.currentChapterIndex &&
        bookStore.chapters.length > 0 &&
        newIndex >= 0 &&
        newIndex < bookStore.chapters.length
      ) {
        console.log(
          `Chapter index changed from ${oldIndex} to ${newIndex}. Navigating to chapter.`,
        )
        bookStore.goToChapter(newIndex)
      } else if (isNaN(newIndex) && route.name === 'Reader') {
        console.warn('Invalid chapter index provided. Navigating to chapter 0.')
        bookStore.goToChapter(0)
        updateRoute(parseInt(props.bookId, 10), 0)
      }
    },
  )

  watch(
    () => bookStore.currentChapterIndex,
    (newIndex, oldIndex) => {
      if (
        newIndex !== oldIndex &&
        bookStore.chapters.length > 0 &&
        !bookStore.isLoading
      ) {
        const currentBookId = bookStore.chapters[0]?.bookId
        if (currentBookId !== undefined) {
          updateRoute(currentBookId, newIndex)
        } else {
          console.warn('无法获取当前书籍的 bookId，无法更新 URL。')
        }

        window.scrollTo({ top: 0, behavior: 'smooth' })
      }

      if (
        newIndex === 0 &&
        oldIndex !== 0 &&
        bookStore.chapters.length > 0 &&
        !bookStore.isLoading
      ) {
        const currentBookId = bookStore.chapters[0]?.bookId
        if (currentBookId !== undefined) {
          updateRoute(currentBookId, 0)
        }
      }
    },
  )

  onUnmounted(() => {
    if (cleanupKeyboardListener) {
      cleanupKeyboardListener()
    }
  })
</script>
