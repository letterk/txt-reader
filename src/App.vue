<!-- src/App.vue -->
<template>
  <div class="mx-auto w-800px">
    <header v-if="!bookStore.bookTitle" class="py-8 text-center">
      <h1 class="text-4xl font-bold">简单小说阅读器</h1>
    </header>

    <main class="py-4">
      <!-- 文件选择区域和加载状态 -->
      <input
        ref="fileInput"
        type="file"
        accept=".txt"
        style="display: none"
        @change="handleFileChange"
      />

      <div
        v-if="!bookStore.isLoading && !bookStore.bookTitle"
        class="min-h-screen flex items-center justify-center"
      >
        <v-btn type="primary" size="large" @click="triggerFileInput">
          选择小说文件
        </v-btn>
      </div>

      <v-overlay
        :model-value="bookStore.isLoading"
        class="align-center justify-center"
      >
        <v-progress-circular
          color="primary"
          indeterminate
          size="64"
        ></v-progress-circular>
      </v-overlay>
      <!-- ReaderView 组件，现在由内容自身撑开高度 -->
      <ReaderView v-if="bookStore.bookTitle" />
    </main>

    <!-- 底部导航栏，根据是否有书名显示/隐藏 -->
    <footer v-if="bookStore.bookTitle" class="py-8 text-center">
      <BottomNav />
    </footer>

    <DirectoryDrawer />
  </div>
</template>

<script setup>
  import { ref, watch, onMounted, onUnmounted } from 'vue'
  import { useBookStore } from './stores/bookStore'
  import ReaderView from './components/ReaderView.vue'
  import BottomNav from './components/BottomNav.vue'
  import DirectoryDrawer from './components/DirectoryDrawer.vue'
  import { setupKeyboardListener } from './utils/keyboardHandler'

  const fileInput = ref(null)
  const bookStore = useBookStore()

  let cleanupKeyboardListener = null

  const triggerFileInput = () => {
    fileInput.value.click()
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      bookStore.loadBook(file)
    }
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

  onMounted(() => {
    console.log('App 组件已挂载，设置键盘监听器...')
    cleanupKeyboardListener = setupKeyboardListener(bookStore)
  })

  onUnmounted(() => {
    console.log('App 组件即将卸载，移除键盘监听器...')
    if (cleanupKeyboardListener) {
      cleanupKeyboardListener()
    }
  })
</script>

<style scoped></style>
