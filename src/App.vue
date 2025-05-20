<!-- src/App.vue -->
<template>
  <n-layout class="mx-auto min-h-screen w-800px">
    <n-layout-header
      v-if="!bookStore.bookTitle"
      bordered
      class="py-2 text-center"
    >
      <div>
        <h1 class="text-2xl font-bold">
          {{ '简单小说阅读器' }}
        </h1>
      </div>
    </n-layout-header>

    <!-- 主要内容区域 -->
    <n-layout-content>
      <input
        ref="fileInput"
        type="file"
        accept=".txt"
        style="display: none"
        @change="handleFileChange"
      />

      <n-flex
        v-if="!bookStore.isLoading && !bookStore.bookTitle"
        justify="center"
      >
        <n-button type="primary" size="large" @click="triggerFileInput">
          选择小说文件
        </n-button>
      </n-flex>

      <n-spin :show="bookStore.isLoading">
        <div v-if="bookStore.bookTitle">
          <ReaderView />
        </div>
      </n-spin>
    </n-layout-content>
    <!-- 导航栏 -->
    <n-layout-footer v-if="bookStore.bookTitle">
      <BottomNav />
    </n-layout-footer>

    <!-- 目录抽屉将在这里添加 -->
    <!-- <DirectoryDrawer /> -->
  </n-layout>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import { useBookStore } from './stores/bookStore'
  import {
    NButton,
    NSpin,
    NLayout,
    NLayoutHeader,
    NLayoutContent,
    NLayoutFooter,
    NFlex,
  } from 'naive-ui'
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

  // --- 修改 watch 代码 ---
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
    { immediate: true }, // 立即执行一次，处理初始状态
  )
  // --- watch 代码结束 ---
</script>

<style scoped>
  /* App.vue 中的全局或布局样式 */
  /* 注意：n-layout-content 默认可能没有滚动行为，如果内容超出屏幕，
           可能需要给它添加 overflow-y: auto 或者让其子元素处理滚动 */
</style>
