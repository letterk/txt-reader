<template>
  <div class="mt-4 flex justify-center space-x-4">
    <button
      class="rounded bg-gray-400 px-4 py-2 text-white hover:bg-gray-500"
      @click="goToBookshelf"
    >
      书架
    </button>

    <button
      :disabled="bookStore.isFirstChapter || bookStore.isLoading"
      class="rounded bg-blue-500 px-4 py-2 text-white disabled:cursor-not-allowed hover:bg-blue-600 disabled:opacity-50"
      @click="bookStore.goToPrevChapter()"
    >
      上一章
    </button>

    <button
      :disabled="bookStore.chapters.length === 0 || bookStore.isLoading"
      class="rounded bg-gray-200 px-4 py-2 text-gray-800 disabled:cursor-not-allowed hover:bg-gray-300 disabled:opacity-50"
      @click="bookStore.toggleDrawer()"
    >
      目录
    </button>

    <button
      :disabled="bookStore.isLastChapter || bookStore.isLoading"
      class="rounded bg-blue-500 px-4 py-2 text-white disabled:cursor-not-allowed hover:bg-blue-600 disabled:opacity-50"
      @click="bookStore.goToNextChapter()"
    >
      下一章
    </button>
  </div>
</template>

<script setup>
  import { useBookStore } from '../stores/bookStore'
  import { useRouter } from 'vue-router'

  const bookStore = useBookStore()
  const router = useRouter()

  const goToBookshelf = () => {
    router.push({ name: 'Bookshelf' })
  }
</script>
