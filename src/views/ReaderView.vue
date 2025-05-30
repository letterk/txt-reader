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
      <!-- 使用 currentChapterLines getter 显示章节内容 -->
      <p
        v-for="(line, index) in bookStore.currentChapterLines"
        :key="index"
        class="my-2 indent-lg"
      >
        {{ line }}
      </p>
    </div>
  </div>

  <!-- 只有在有书且不加载时才显示导航和目录按钮 -->
  <ReaderNav v-if="bookStore.bookTitle && !bookStore.isLoading" />

  <!-- 只有在有书且不加载时才显示目录抽屉 -->
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
    chapterId: {
      type: String,
      required: false,

      default: undefined,
    },
  })

  const loadBook = async (id, targetChapterIdStr) => {
    const targetChapterId =
      targetChapterIdStr !== undefined
        ? parseInt(targetChapterIdStr, 10)
        : undefined

    if (bookStore.chapters.length > 0 && bookStore.chapters[0]?.bookId === id) {
      const chapterIdToGo =
        targetChapterId !== undefined
          ? targetChapterId
          : bookStore.currentChapterId !== null
            ? bookStore.currentChapterId
            : bookStore.chapters[0]?.id

      if (chapterIdToGo !== undefined) {
        bookStore.goToChapterById(chapterIdToGo)
      } else {
        console.warn('无法确定要导航到的章节 ID.')
      }

      const currentChapterInStore = bookStore.currentChapter
      const currentChapterIdInStore = currentChapterInStore
        ? currentChapterInStore.id
        : undefined

      if (
        targetChapterId !== undefined &&
        targetChapterId !== currentChapterIdInStore
      ) {
        const targetChapter = bookStore.chapters.find(
          (c) => c.id === targetChapterId,
        )
        if (targetChapter) {
          bookStore.goToChapterById(targetChapterId)
        } else {
          console.warn(
            `路由参数中的章节 ID ${targetChapterId} 在已加载书籍中不存在。导航到第一章。`,
          )

          const firstChapterId = bookStore.chapters[0]?.id
          if (firstChapterId !== undefined) {
            bookStore.goToChapterById(firstChapterId)
          } else {
            console.error('已加载书籍没有第一章，无法导航。')

            bookStore.setBookData('', [])
            router.replace({ name: 'Bookshelf' }).catch(console.error)
          }
        }
      } else if (
        targetChapterId === undefined &&
        currentChapterIdInStore !== undefined
      ) {
        updateRoute(id, currentChapterIdInStore)
      } else if (
        targetChapterId === undefined &&
        currentChapterIdInStore === undefined
      ) {
        const firstChapterId = bookStore.chapters[0]?.id
        if (firstChapterId !== undefined) {
          bookStore.goToChapterById(firstChapterId)
        }
      }

      return
    }

    bookStore.setLoading(true)

    try {
      const book = await getBookById(id)

      if (book && book.chapters.length > 0) {
        const chaptersWithBookId = book.chapters.map((chapter) => ({
          ...chapter,
          bookId: book.id,
        }))

        bookStore.setBookData(book.bookTitle, chaptersWithBookId)

        let finalChapterIdToLoad = bookStore.chapters[0].id

        if (targetChapterId !== undefined) {
          const foundChapter = chaptersWithBookId.find(
            (c) => c.id === targetChapterId,
          )
          if (foundChapter) {
            finalChapterIdToLoad = targetChapterId
          } else {
            console.warn(
              `路由参数指定的章节 ID ${targetChapterId} 不存在于书籍中。导航到第一章 (${finalChapterIdToLoad})。`,
            )
          }
        }

        bookStore.goToChapterById(finalChapterIdToLoad)
      } else {
        if (!book) {
          console.warn(`数据库中未找到书籍 ID: ${id}`)
        } else {
          console.warn(`书籍 ID: ${id} 《${book.bookTitle}》 没有章节数据。`)
        }

        bookStore.setBookData('', [])

        router.replace({ name: 'Bookshelf' }).catch((err) => {
          console.error('书籍不存在或无章节，导航回书架页失败:', err)
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

  const updateRoute = (bookId, chapterId) => {
    const currentBookId = route.params.bookId
    const currentChapterIdInRoute = route.params.chapterId
      ? parseInt(route.params.chapterId, 10)
      : undefined

    if (currentBookId !== bookId || currentChapterIdInRoute !== chapterId) {
      router
        .replace({
          name: 'Reader',
          params: {
            bookId: bookId,
            chapterId: chapterId.toString(),
          },
        })
        .catch((err) => {
          console.error('更新路由失败:', err)
        })
    }
  }

  let cleanupKeyboardListener = null

  onMounted(() => {
    loadBook(props.bookId, props.chapterId)

    cleanupKeyboardListener = setupKeyboardListener(bookStore)

    bookStore.isDrawerVisible = false
  })

  watch(
    () => props.bookId,
    (newBookId) => {
      if (
        newBookId &&
        bookStore.chapters.length > 0 &&
        bookStore.chapters[0]?.bookId !== newBookId
      ) {
        loadBook(newBookId, undefined)
      } else if (
        newBookId &&
        bookStore.chapters.length > 0 &&
        bookStore.chapters[0]?.bookId === newBookId
      ) {
        loadBook(newBookId, undefined)
      } else if (newBookId && bookStore.chapters.length === 0) {
        loadBook(newBookId, undefined)
      }
    },
  )

  watch(
    () => props.chapterId,
    (newChapterIdStr) => {
      const newChapterId =
        newChapterIdStr !== undefined
          ? parseInt(newChapterIdStr, 10)
          : undefined

      if (
        newChapterId !== undefined &&
        newChapterId !== bookStore.currentChapterId &&
        bookStore.chapters.length > 0
      ) {
        bookStore.goToChapterById(newChapterId)
      } else if (
        newChapterIdStr === undefined &&
        bookStore.chapters.length > 0
      ) {
        if (bookStore.currentChapterId !== null) {
          updateRoute(props.bookId, bookStore.currentChapterId)
        } else {
          const firstChapterId = bookStore.chapters[0]?.id
          if (firstChapterId !== undefined) {
            bookStore.goToChapterById(firstChapterId)
          }
        }
      }
    },
  )

  watch(
    () => bookStore.currentChapterId,
    (newChapterId, oldChapterId) => {
      if (
        newChapterId !== null &&
        newChapterId !== oldChapterId &&
        bookStore.chapters.length > 0 &&
        !bookStore.isLoading
      ) {
        const currentBookId = bookStore.chapters[0]?.bookId

        if (currentBookId !== undefined) {
          updateRoute(currentBookId, newChapterId)
        } else {
          console.warn(
            '无法获取当前书籍的 bookId，无法更新 URL 中的 chapterId。',
          )
        }

        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else if (newChapterId === null && bookStore.bookTitle) {
        console.warn('当前章节 ID 变为 null，但书籍信息仍在。')
      }
    },
  )

  onUnmounted(() => {
    if (cleanupKeyboardListener) {
      cleanupKeyboardListener()
    }
  })
</script>
