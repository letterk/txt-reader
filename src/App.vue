<template>
  <div :class="theme === 'dark' ? 'dark' : 'light'" class="min-h-screen">
    <div class="mx-auto w-800px px-4">
      <router-view />
    </div>

    <!-- 主题切换按钮 -->
    <button
      class="fixed left-4 top-4 rounded bg-gray-200 px-3 py-1 text-xs dark:bg-gray-700 dark:text-white focus:outline-none"
      @click="toggleTheme"
    >
      切换主题
    </button>
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue'

  import { useBookStore } from './stores/bookStore'

  const bookStore = useBookStore()

  const theme = ref('dark')

  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  watch(
    [() => bookStore.bookTitle, () => bookStore.currentChapter],
    ([newTitle, newChapter]) => {
      let pageTitle = '简单小说阅读器'
      if (newTitle) {
        pageTitle = newTitle

        if (newChapter && newChapter.title) {
          pageTitle += ` - ${newChapter.title}`
        }
      }
      document.title = pageTitle
    },
    { immediate: true },
  )
</script>

<style scoped>
  .light {
    background-color: #ffffff;
    color: #000000;
  }

  .dark {
    background-color: #1e1e1e;
    color: #e0e0e0;
  }
</style>
