<template>
  <!-- 使用 UnoCSS flex 布局 -->
  <div class="mt-4 flex justify-center space-x-4">
    <!-- 上一章按钮 -->
    <button
      :disabled="bookStore.isFirstChapter || bookStore.isLoading"
      class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      @click="bookStore.goToPrevChapter()"
    >
      上一章
    </button>

    <!-- 目录按钮 -->
    <button
      :disabled="bookStore.chapters.length === 0 || bookStore.isLoading"
      class="rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
      @click="bookStore.toggleDrawer()"
    >
      目录
    </button>

    <!-- 下一章按钮 -->
    <button
      :disabled="bookStore.isLastChapter || bookStore.isLoading"
      class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      @click="bookStore.goToNextChapter()"
    >
      下一章
    </button>
  </div>
</template>

<script setup>
  import { useBookStore } from '../stores/bookStore'
  const bookStore = useBookStore()
</script>
