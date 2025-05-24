<!-- src/components/DirectoryDrawer.vue -->
<template>
  <v-navigation-drawer
    v-model="bookStore.isDrawerVisible"
    location="left"
    :width="300"
    temporary
    @update:model-value="handleDrawerUpdateShow"
  >
    <v-list-item
      :title="bookStore.bookTitle || '目录'"
      class="text-h6 font-weight-bold"
      density="comfortable"
    ></v-list-item>

    <v-divider></v-divider>

    <v-virtual-scroll
      :items="bookStore.chaptersListForNav"
      height="calc(100vh - 100px)"
      item-height="10"
    >
      <template #default="{ item }">
        <v-list-item
          :id="`chapter-item-${item.index}`"
          :key="item.index"
          :value="item.index"
          :title="item.title"
          :active="item.index === bookStore.currentChapterIndex"
          density="comfortable"
          @click="handleChapterClick(item.index)"
        ></v-list-item>
      </template>
    </v-virtual-scroll>
  </v-navigation-drawer>
</template>

<script setup>
  import { watch, nextTick } from 'vue'
  import { useBookStore } from '../stores/bookStore'

  const bookStore = useBookStore()

  // 移除焦点
  const removeFocus = () => {
    if (document.activeElement) {
      document.activeElement.blur()
    }
  }

  // 抽屉显示/隐藏的事件处理
  const handleDrawerUpdateShow = (newValue) => {
    bookStore.isDrawerVisible = newValue
    if (newValue) {
      scrollToCurrentChapter()
    }
  }

  // 章节点击事件处理
  const handleChapterClick = (index) => {
    bookStore.goToChapter(index)
    bookStore.toggleDrawer()

    nextTick(() => {
      removeFocus()
      scrollToCurrentChapter()
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
          element.scrollIntoView({ block: 'center' })
        } else {
          console.warn(`未找到章节元素: ${itemId}`)
        }
      })
    }
  }

  watch(
    () => bookStore.currentChapterIndex,
    (newIndex, oldIndex) => {
      // 只有当章节实际变化时才触发滚动
      if (newIndex !== oldIndex) {
        scrollToCurrentChapter()
      }
    },
  )
</script>

<style scoped>
  /* 抽屉组件的样式 */
</style>
