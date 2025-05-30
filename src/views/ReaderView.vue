<template>
  <div class="w-full flex flex-col py-2">
    <h2 class="mb-4 flex-shrink-0 text-center text-4xl font-bold">
      <span v-if="isLoading">正在加载书籍...</span>
      <span v-else-if="!bookStore.bookTitle">请选择小说文件</span>
      <span v-else>{{
        bookStore.currentChapter?.title || '章节加载中...'
      }}</span>
    </h2>

    <div
      v-if="!bookStore.bookTitle && !isLoading"
      class="text-center text-gray-500"
    >
      请在书架选择一本小说阅读。
    </div>
    <div
      v-else-if="bookStore.bookTitle && !isLoading"
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

  <ReaderNav v-if="bookStore.bookTitle && !isLoading" />

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
    if (bookStore.cachedBookId === id && !targetChapterIdStr) {
      return
    }

    const targetChapterId = targetChapterIdStr
      ? parseInt(targetChapterIdStr, 10)
      : undefined

    if (bookStore.cachedBookId === id && bookStore.chapters.length > 0) {
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
          console.warn(`章节 ID ${targetChapterId} 不存在，跳转到第一章`)
          bookStore.goToChapterById(bookStore.chapters[0].id)
        }
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

  let cleanupKeyboardListener = null

  watch(
    () => props.bookId,
    (newId) => newId && loadBook(newId, props.chapterId),
  )
  watch(
    () => props.chapterId,
    (newId) => newId && bookStore.goToChapterById(parseInt(newId, 10)),
  )
  watch(
    () => bookStore.currentChapterId,
    (newId) => {
      if (newId !== null && bookStore.chapters.length > 0 && !isLoading.value) {
        updateRoute(bookStore.chapters[0].bookId, newId)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
  )

  onMounted(() => {
    loadBook(props.bookId, props.chapterId)
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
</script>
