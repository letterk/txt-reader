<!-- src/App.vue -->
<template>
  <!-- **修改点：移除 h-screen flex flex-col，让容器高度自适应内容** -->
  <!-- **保留 mx-auto 和 w-800px 控制内容区域的宽度和居中** -->
  <div class="mx-auto w-800px">
    <!-- 头部，根据是否有书名显示/隐藏 -->
    <!-- **修改点：移除 flex-shrink-0，让它自然排列** -->
    <header v-if="!bookStore.bookTitle" class="py-8 text-center">
      <h1 class="text-4xl font-bold">简单小说阅读器</h1>
    </header>

    <!-- 主要内容区域 -->
    <!-- **修改点：移除 flex-grow overflow-hidden，让它自然排列和滚动** -->
    <!-- **新增点：添加 py-4 的内边距，与 header 和 footer 区分** -->
    <main class="py-4">
      <!-- 文件选择区域和加载状态 -->
      <input
        ref="fileInput"
        type="file"
        accept=".txt"
        style="display: none"
        @change="handleFileChange"
      />

      <!-- **修改点：移除 h-full，flex items-center justify-center 保留用于居中按钮** -->
      <div
        v-if="!bookStore.isLoading && !bookStore.bookTitle"
        class="min-h-screen flex items-center justify-center"
      >
        <n-button type="primary" size="large" @click="triggerFileInput">
          选择小说文件
        </n-button>
      </div>

      <n-spin :show="bookStore.isLoading" class="min-h-screen">
        <!-- ReaderView 组件，现在由内容自身撑开高度 -->
        <!-- **修改点：移除 h-full，ReaderView 内部内容容器现在负责滚动** -->
        <ReaderView v-if="bookStore.bookTitle" />
      </n-spin>
    </main>

    <!-- 底部导航栏，根据是否有书名显示/隐藏 -->
    <!-- **修改点：移除 flex-shrink-0，让它自然排列** -->
    <footer v-if="bookStore.bookTitle" class="py-8 text-center">
      <BottomNav />
    </footer>

    <!-- 目录抽屉，它通常不受父容器布局影响 -->
    <DirectoryDrawer />
  </div>
</template>

<script setup>
  import { ref, watch, onMounted, onUnmounted } from 'vue'
  import { useBookStore } from './stores/bookStore'
  import { NButton, NSpin } from 'naive-ui'
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
