<!-- src/components/BottomNav.vue -->
<template>
  <!-- 使用 n-flex 进行水平布局 -->
  <div class="mt-4 flex justify-center">
    <!-- 上一章按钮 -->
    <v-btn
      :disabled="bookStore.isFirstChapter || bookStore.isLoading"
      type="primary"
      @click="bookStore.goToPrevChapter()"
    >
      上一章
    </v-btn>

    <!-- 目录按钮 -->
    <v-btn
      class="mx-4"
      :disabled="bookStore.chapters.length === 0 || bookStore.isLoading"
      type="info"
      @click="bookStore.toggleDrawer()"
    >
      目录
    </v-btn>

    <!-- 下一章按钮 -->
    <v-btn
      :disabled="bookStore.isLastChapter || bookStore.isLoading"
      type="primary"
      @click="bookStore.goToNextChapter()"
    >
      下一章
    </v-btn>
  </div>
</template>

<script setup>
  import { useBookStore } from '../stores/bookStore'
  const bookStore = useBookStore()
</script>

<style scoped>
  /* 尽量避免在这里写样式 */
</style>
