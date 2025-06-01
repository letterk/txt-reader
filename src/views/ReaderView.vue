<template>
  <div ref="readerContainerRef" class="w-full flex flex-col">
    <div
      v-for="chapter in bookStore.displayedChaptersContent"
      :id="`chapter-content-${chapter.id}`"
      :key="chapter.id"
      :data-chapter-id="chapter.id"
      class="chapter-block"
    >
      <p class="my-8 text-center text-1.5em font-bold dark:text-gray-100">
        {{ chapter.title }}
      </p>
      <p
        v-for="(line, index) in chapter.lines"
        :key="index"
        class="mb-0.2em indent-2em text-20px line-height-1.5em"
      >
        {{ line.text }}
      </p>
    </div>

    <div
      v-if="!isLoadingInitial && bookStore.canLoadMoreChaptersForward"
      ref="nextChapterSentinelRef"
      class="h-10"
    ></div>
    <div v-if="isLoadingMore" class="py-4 text-center">正在加载更多章节...</div>
  </div>

  <ReaderToc v-if="bookStore.bookTitle && !isLoadingInitial" />
</template>

<script setup>
  import { defineProps } from 'vue'
  import { useReaderLogic } from '../composables/useReaderLogic'
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

  const {
    bookStore,
    isLoadingInitial,
    isLoadingMore,
    nextChapterSentinelRef,
    readerContainerRef,
  } = useReaderLogic(props)
</script>
