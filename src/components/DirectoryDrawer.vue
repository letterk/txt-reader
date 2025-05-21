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
      item-height="48"
    >
      <template #default="{ item }">
        <v-list-item
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
  import { useBookStore } from '../stores/bookStore'

  const bookStore = useBookStore()

  // 抽屉显示/隐藏的事件处理
  const handleDrawerUpdateShow = (newValue) => {
    bookStore.isDrawerVisible = newValue
  }

  // 章节点击事件处理
  const handleChapterClick = (index) => {
    console.log(`点击章节：跳转到章节索引 ${index}`)
    bookStore.goToChapter(index)
    bookStore.toggleDrawer()
  }
</script>

<style scoped>
  /* 抽屉组件的样式 */
</style>
