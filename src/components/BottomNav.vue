<!-- src/components/BottomNav.vue -->
<template>
  <!-- 使用 n-flex 进行水平布局 -->
  <n-flex justify="center" class="mt-4">
    <!-- 上一章按钮 -->
    <n-button
      :disabled="bookStore.isFirstChapter || bookStore.isLoading"
      type="primary"
      @click="bookStore.goToPrevChapter()"
    >
      上一章
    </n-button>

    <!-- 目录按钮 -->
    <n-button
      class="mx-4"
      :disabled="bookStore.chapters.length === 0 || bookStore.isLoading"
      type="info"
      @click="bookStore.toggleDrawer()"
    >
      目录
    </n-button>

    <!-- 下一章按钮 -->
    <n-button
      :disabled="bookStore.isLastChapter || bookStore.isLoading"
      type="primary"
      @click="bookStore.goToNextChapter()"
    >
      下一章
    </n-button>
  </n-flex>
</template>

<script setup>
  import { useBookStore } from '../stores/bookStore'
  import { NButton, NFlex } from 'naive-ui'

  const bookStore = useBookStore()
</script>

<style scoped>
  /* 尽量避免在这里写样式 */
</style>
