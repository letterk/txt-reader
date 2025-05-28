<!-- src/components/ReaderView.vue -->
<template>
  <!-- 最外层容器，提供垂直布局和内边距 -->
  <div class="w-full flex flex-col py-2">
    <!-- 显示当前章节标题 -->
    <h2 class="mb-4 flex-shrink-0 text-center text-4xl font-bold">
      {{ bookStore.currentChapter?.title || '请选择小说文件' }}
    </h2>

    <!-- 内容区域容器，现在让内容自然流动，由页面整体滚动 -->
    <div class="text-5 line-height-7">
      <p
        v-for="(line, index) in bookStore.currentChapterLines"
        :key="index"
        class="my-2 indent-lg"
      >
        {{ line }}
      </p>
    </div>
  </div>
</template>

<script setup>
  import { watch } from 'vue'
  import { useBookStore } from '../stores/bookStore'

  const bookStore = useBookStore()

  watch(
    () => bookStore.currentChapterIndex,
    (newIndex, oldIndex) => {
      // 确保新旧索引不同，或者这是第一次加载时（oldIndex 可能是 undefined）
      // 并且 Store 中有章节数据
      if (newIndex !== oldIndex && bookStore.chapters.length > 0) {
        // console.log(`章节从索引 ${oldIndex} 切换到 ${newIndex}, 滚动到顶部`)

        window.scrollTo(0, 0)

        // 兼容旧浏览器
        if (document.documentElement.scrollTop !== 0) {
          document.documentElement.scrollTop = 0
        } else {
          document.body.scrollTop = 0
        }
      }
    },
    {
      immediate: true,
    },
  )
</script>

<style scoped>
  /* 尽量避免在这里写样式 */
</style>
