<template>
  <div class="w-full flex flex-col">
    <div
      v-if="bookStore.bookTitle && !isLoading"
      class="text-20px line-height-1.5em"
    >
      <p
        v-for="(line, index) in bookStore.currentChapterLines"
        :key="index"
        :class="{
          'text-center text-1.5em font-bold mb-8 mt-4': line.isTitle,
          'indent-2em mb-0.2em': !line.isTitle,
        }"
      >
        {{ line.text }}
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
