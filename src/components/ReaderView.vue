<!-- src/components/ReaderView.vue -->
<template>
  <!-- 最外层容器，提供垂直布局和内边距 -->
  <n-flex vertical class="w-full py-2">
    <!-- 内容块容器，设置固定宽度并居中 -->
    <!-- 显示当前章节标题 -->
    <!-- H2 文本在父容器内居中 -->
    <h2 class="text-center text-2xl font-bold">
      {{ bookStore.currentChapter?.title || '请选择小说文件' }}
    </h2>

    <!-- 显示当前章节内容 -->
    <div class="text-justify text-xl">
      <!-- 使用 v-for 循环渲染每一行内容 -->
      <p
        v-for="(line, index) in chapterLines"
        :key="index"
        class="my-2 indent-lg"
      >
        {{ line }}
      </p>
      <!-- 虚拟列表将在后面替换这里 -->
    </div>
  </n-flex>
</template>

<script setup>
  import { useBookStore } from '../stores/bookStore' // 导入 store
  import { NFlex } from 'naive-ui' // 导入 Naive UI 组件
  import { computed } from 'vue'

  const bookStore = useBookStore() // 获取 store 实例

  // 将当前章节内容按行分割，方便后续替换为虚拟列表
  // 确保过滤掉空行
  const chapterLines = computed(() => {
    // 获取当前章节内容
    const content = bookStore.currentChapterContent
    // 如果内容存在，按行分割，并过滤掉只有空白字符的行，否则返回空数组
    return content
      ? content.split('\n').filter((line) => line.trim() !== '')
      : []
  })
</script>

<style scoped>
  /* 尽量避免在这里写样式 */
  /* Naive UI 组件自带样式，UnoCSS 原子类直接在 class 中 */
</style>
