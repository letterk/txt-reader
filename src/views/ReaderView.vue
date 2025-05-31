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
  import { defineProps } from 'vue'

  import { useReaderLogic } from '../composables/useReaderLogic'

  import ReaderNav from '../components/ReaderNav.vue'
  import ReaderToc from '../components/ReaderToc.vue'

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

  const { bookStore, isLoading } = useReaderLogic(props)
</script>
