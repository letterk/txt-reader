<!-- src/components/DirectoryDrawer.vue -->
<template>
  <!-- 根据 bookStore.isDrawerVisible 控制显示/隐藏，并添加过渡效果 -->
  <div
    id="directory-drawer"
    :class="{
      'transform translate-x-0': bookStore.isDrawerVisible,
      'transform -translate-x-full': !bookStore.isDrawerVisible,
    }"
    class="fixed inset-y-0 left-0 z-1 w-300px overflow-y-auto bg-white shadow-lg transition-transform duration-300 ease-in-out dark:bg-gray-800"
  >
    <!-- 抽屉头部，显示书名 -->
    <div class="border-b border-gray-200 p-4 dark:border-gray-700">
      <h2 class="text-lg font-bold dark:text-white">
        {{ bookStore.bookTitle || '目录' }}
      </h2>
    </div>

    <!-- 目录列表容器，使用 flex-grow 使其占据剩余空间并允许滚动 -->
    <ul class="flex flex-col">
      <!-- 遍历 chaptersListForNav 渲染章节列表 -->
      <li
        v-for="item in bookStore.chaptersListForNav"
        :id="`chapter-item-${item.index}`"
        :key="item.index"
        :class="{
          'bg-blue-100 dark:bg-blue-900':
            item.index === bookStore.currentChapterIndex,
          'hover:bg-gray-100 dark:hover:bg-gray-700':
            item.index !== bookStore.currentChapterIndex,
        }"
        class="px-4 py-2 text-gray-800 dark:text-gray-200"
        @click="handleChapterClick(item.index)"
      >
        {{ item.title }}
      </li>
    </ul>
  </div>

  <!-- 抽屉外部的半透明遮罩层 -->
  <div
    v-if="bookStore.isDrawerVisible"
    class="fixed inset-0 bg-black bg-opacity-50"
    @click="bookStore.toggleDrawer()"
  ></div>
</template>

<script setup>
  import { watch, nextTick } from 'vue'
  import { useBookStore } from '../stores/bookStore'

  const bookStore = useBookStore()

  // 章节点击事件处理
  const handleChapterClick = (index) => {
    bookStore.goToChapter(index)
    bookStore.toggleDrawer() // 关闭抽屉

    nextTick(() => {
      scrollToCurrentChapter() // 滚动到当前章节
    })
  }

  const scrollToCurrentChapter = () => {
    if (
      bookStore.currentChapterIndex >= 0 &&
      bookStore.chaptersListForNav.length > 0
    ) {
      nextTick(() => {
        const itemId = `chapter-item-${bookStore.currentChapterIndex}`
        const element = document.getElementById(itemId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        } else {
          console.warn(`未找到章节元素: ${itemId}`)
        }
      })
    }
  }

  // 监听章节索引变化，当抽屉打开时滚动到当前章节
  watch(
    () => bookStore.currentChapterIndex,
    (newIndex, oldIndex) => {
      if (newIndex !== oldIndex && bookStore.isDrawerVisible) {
        scrollToCurrentChapter()
      }
    },
  )

  // 监听抽屉是否打开，如果打开则滚动到当前章节
  watch(
    () => bookStore.isDrawerVisible,
    (isVisible) => {
      if (isVisible) {
        scrollToCurrentChapter()
      }
    },
  )
</script>
