<template>
  <div class="w-full flex flex-col py-2">
    <h2 class="mb-4 flex-shrink-0 text-center text-4xl font-bold">
      <!-- 使用组件内部的 isLoading 状态 -->
      <span v-if="isLoading">正在加载书籍...</span>
      <span v-else-if="!bookStore.bookTitle">请选择小说文件</span>
      <span v-else>{{
        bookStore.currentChapter?.title || '章节加载中...'
      }}</span>
    </h2>

    <!-- 使用组件内部的 isLoading 状态 -->
    <div
      v-if="!bookStore.bookTitle && !isLoading"
      class="text-center text-gray-500"
    >
      请在书架选择一本小说阅读。
    </div>
    <!-- 使用组件内部的 isLoading 状态 -->
    <div
      v-else-if="bookStore.bookTitle && !isLoading"
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
  <!-- 使用组件内部的 isLoading 状态 -->
  <ReaderNav v-if="bookStore.bookTitle && !isLoading" />

  <!-- 只有在有书且不加载时才显示目录抽屉 -->
  <!-- 使用组件内部的 isLoading 状态 -->
  <ReaderToc v-if="bookStore.bookTitle && !isLoading" />
</template>

<script setup>
  import { ref, watch, onMounted, onUnmounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { useBookStore } from '../stores/bookStore'

  import { getBookById } from '../utils/database'

  import { setupKeyboardListener } from '../utils/keyboardHandler'

  import ReaderNav from '../components/ReaderNav.vue'
  import ReaderToc from '../components/ReaderToc.vue'

  const bookStore = useBookStore()

  const route = useRoute()
  const router = useRouter()

  const isLoading = ref(false)

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
      if (
        targetChapterId !== undefined &&
        targetChapterId !== bookStore.currentChapterId
      ) {
        const targetChapter = bookStore.chapters.find(
          (c) => c.id === targetChapterId,
        )
        if (targetChapter) {
          bookStore.goToChapterById(targetChapterId)
        } else {
          console.warn(
            `路由参数中的章节 ID ${targetChapterId} 在已加载书籍中不存在。`,
          )

          const firstChapterId = bookStore.chapters[0]?.id
          if (firstChapterId !== undefined) {
            bookStore.goToChapterById(firstChapterId)
          }
        }
      } else if (
        targetChapterId === undefined &&
        bookStore.currentChapterId === null &&
        bookStore.chapters.length > 0
      ) {
        const firstChapterId = bookStore.chapters[0]?.id
        if (firstChapterId !== undefined) {
          bookStore.goToChapterById(firstChapterId)
        }
      } else if (
        targetChapterId === undefined &&
        bookStore.currentChapterId !== null
      ) {
        updateRoute(id, bookStore.currentChapterId)
      }

      return
    }

    isLoading.value = true
    bookStore.setBookData('', [])

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
        } else {
          console.log('路由未指定章节 ID，默认加载第一章。')
        }

        bookStore.goToChapterById(finalChapterIdToLoad)

        updateRoute(
          id,
          bookStore.currentChapterId !== null
            ? bookStore.currentChapterId
            : finalChapterIdToLoad,
        )
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
      isLoading.value = false
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
    console.log('ReaderView 组件已挂载')

    loadBook(props.bookId, props.chapterId)

    cleanupKeyboardListener = setupKeyboardListener(bookStore, isLoading)

    bookStore.isDrawerVisible = false
  })

  watch(
    () => props.bookId,
    (newBookId, oldBookId) => {
      if (newBookId && newBookId !== oldBookId) {
        console.log(
          `bookId 变化：从 ${oldBookId} 到 ${newBookId}，重新加载书籍。`,
        )

        loadBook(newBookId, undefined)
      }
    },
  )

  watch(
    () => props.chapterId,
    (newChapterIdStr, oldChapterIdStr) => {
      const newChapterId =
        newChapterIdStr !== undefined
          ? parseInt(newChapterIdStr, 10)
          : undefined
      const oldChapterId =
        oldChapterIdStr !== undefined
          ? parseInt(oldChapterIdStr, 10)
          : undefined

      if (
        newChapterId !== undefined &&
        newChapterId !== oldChapterId &&
        newChapterId !== bookStore.currentChapterId &&
        bookStore.chapters.length > 0
      ) {
        console.log(
          `chapterId 变化：从 ${oldChapterId} 到 ${newChapterId}，跳转章节。`,
        )
        bookStore.goToChapterById(newChapterId)
      } else if (
        newChapterIdStr === undefined &&
        bookStore.chapters.length > 0 &&
        bookStore.currentChapterId !== null
      ) {
        console.log('chapterId 变为 undefined，确保路由和当前章节同步。')
        updateRoute(props.bookId, bookStore.currentChapterId)
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
        !isLoading.value
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
    console.log('ReaderView 组件已卸载')

    if (cleanupKeyboardListener) {
      cleanupKeyboardListener()
    }

    bookStore.setBookData('', [])
  })
</script>
