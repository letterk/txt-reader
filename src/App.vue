<template>
  <div :class="theme === 'dark' ? 'dark' : 'light'" class="min-h-screen">
    <div class="mx-auto w-800px px-4">
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
          <button
            class="rounded-lg bg-blue-500 px-6 py-3 text-lg text-white font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            @click="triggerFileInput"
          >
            选择小说文件
          </button>
        </div>

        <div
          v-if="bookStore.isLoading"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div class="text-xl text-white">加载中...</div>
        </div>

        <ReaderView v-if="bookStore.bookTitle" />
      </main>

      <!-- 底部导航栏，根据是否有书名显示/隐藏 -->
      <footer v-if="bookStore.bookTitle" class="py-8 text-center">
        <BottomNav />
      </footer>

      <!-- DirectoryDrawer 组件，仍然使用但其内部会修改 -->
      <DirectoryDrawer />
    </div>

    <button
      class="fixed left-4 top-4 rounded-full bg-gray-200 px-3 py-1 text-xs dark:bg-gray-700 dark:text-white"
      @click="toggleTheme"
    >
      切换主题
    </button>
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
  const theme = ref('dark') // 保留主题状态，用于切换背景色等

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

  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    // 也可以在这里手动修改 body 的 class 来切换主题，或者让 UnoCSS 处理
    // document.body.classList.toggle('dark', theme.value === 'dark')
  }

  // 监听书名和当前章节变化，更新页面标题
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
    // 根据主题设置 body 的 class，或者依赖 UnoCSS 的 dark 模式
    // document.body.classList.add(theme.value)
    cleanupKeyboardListener = setupKeyboardListener(bookStore)
  })

  onUnmounted(() => {
    console.log('App 组件即将卸载，移除键盘监听器...')
    if (cleanupKeyboardListener) {
      cleanupKeyboardListener()
    }
  })
</script>

<style scoped>
  /* 这里保留 scoped 样式，避免全局污染 */
</style>

<style>
  /* 全局样式 */
  /* 添加一些基础的样式，特别是关于主题切换的 */
  body {
    transition:
      background-color 0.3s ease,
      color 0.3s ease; /* 添加过渡效果 */
  }

  .light {
    background-color: #ffffff; /* 白色背景 */
    color: #000000; /* 黑色文字 */
  }

  .dark {
    background-color: #1e1e1e; /* 深色背景 */
    color: #e0e0e0; /* 浅色文字 */
  }
</style>
