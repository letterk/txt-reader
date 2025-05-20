<!-- src/App.vue -->
<template>
  <!-- 最外层容器，控制整体宽度和水平居中，移除 min-h-screen -->
  <!-- 使用 h-screen 确保容器占据整个视口高度，这样内部 flex 布局才能正常工作 -->
  <div class="mx-auto h-screen w-800px flex flex-col">
    <!-- 头部，根据是否有书名显示/隐藏 -->
    <header v-if="!bookStore.bookTitle" class="flex-shrink-0 py-2 text-center">
      <h1 class="text-2xl font-bold">简单小说阅读器</h1>
    </header>

    <!-- 主要内容区域，flex-grow 占据剩余空间，overflow-hidden 防止外部滚动 -->
    <main class="flex-grow overflow-hidden">
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
        class="h-full flex items-center justify-center"
      >
        <n-button type="primary" size="large" @click="triggerFileInput">
          选择小说文件
        </n-button>
      </div>

      <n-spin :show="bookStore.isLoading" class="h-full">
        <!-- ReaderView 组件，现在需要自己处理高度 -->
        <!-- ReaderView 内部的虚拟列表容器负责滚动 -->
        <ReaderView v-if="bookStore.bookTitle" class="h-full" />
      </n-spin>
    </main>

    <!-- 底部导航栏，flex-shrink-0 确保不被压缩 -->
    <footer v-if="bookStore.bookTitle" class="flex-shrink-0 py-4">
      <BottomNav />
    </footer>

    <!-- 目录抽屉 -->
    <!-- <DirectoryDrawer /> -->
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import { useBookStore } from './stores/bookStore'
  import { NButton, NSpin } from 'naive-ui'
  import ReaderView from './components/ReaderView.vue'
  import BottomNav from './components/BottomNav.vue'

  const fileInput = ref(null)
  const bookStore = useBookStore()

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
    // 同时监听书名和当前章节对象
    // 使用 getter `currentChapter` 方便获取章节标题
    [() => bookStore.bookTitle, () => bookStore.currentChapter],
    ([newTitle, newChapter]) => {
      // 当书名或当前章节变化时执行
      let pageTitle = '简单小说阅读器' // 默认标题
      if (newTitle) {
        // 如果有书名
        pageTitle = newTitle
        if (newChapter && newChapter.title) {
          // 如果有当前章节且有标题，加上章节标题
          pageTitle += ` - ${newChapter.title}`
        }
      }
      // 更新浏览器标题
      document.title = pageTitle
    },
    // 立即执行一次，处理初始状态
    { immediate: true },
  )
</script>

<style scoped></style>
