<!-- src/components/ReaderView.vue -->
<template>
  <!-- 最外层容器，提供垂直布局和内边距 -->
  <!-- **修改点：移除 h-screen，让容器高度自适应内容** -->
  <div class="w-full flex flex-col py-2">
    <!-- 显示当前章节标题 -->
    <h2 class="mb-4 flex-shrink-0 text-center text-2xl font-bold">
      <!-- **新增点：mb-4 添加底部边距** -->
      {{ bookStore.currentChapter?.title || '请选择小说文件' }}
    </h2>

    <!-- 内容区域容器，现在让内容自然流动，由页面整体滚动 -->
    <!-- **修改点：移除 flex-grow overflow-y-auto，移除 ref="contentContainerRef"** -->
    <div class="text-xl">
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
  // **修改点：移除 ref 和 watch，因为滚动由页面整体控制**
  // import { ref, watch } from 'vue'
  import { useBookStore } from '../stores/bookStore'
  // **修改点：移除对 NVirtualList 的导入**
  // import { NVirtualList } from 'naive-ui'

  const bookStore = useBookStore()

  // **修改点：移除滚动相关的代码**
  // const contentContainerRef = ref(null)
  // watch(
  //   () => bookStore.currentChapterIndex,
  //   (newIndex, oldIndex) => {
  //     console.log(`章节从索引 ${oldIndex} 切换到 ${newIndex}`)
  //     if (contentContainerRef.value) {
  //       contentContainerRef.value.scrollTop = 0
  //       console.log('内容区域已滚动到顶部')
  //     }
  //   },
  //   {
  //     immediate: true,
  //   },
  // )
</script>

<style scoped>
  /* 尽量避免在这里写样式 */
</style>
