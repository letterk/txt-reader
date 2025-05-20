<!-- src/components/ReaderView.vue -->
<template>
  <!-- 最外层容器，提供垂直布局和内边距 -->
  <!-- 确保这个容器有高度，例如 h-full，使其内部的虚拟列表能够计算高度 -->
  <div class="h-screen w-full flex flex-col py-2">
    <!-- 内容块容器，设置固定宽度并居中 -->
    <!-- 显示当前章节标题 -->
    <!-- H2 文本在父容器内居中 -->
    <h2 class="flex-shrink-0 text-center text-2xl font-bold">
      {{ bookStore.currentChapter?.title || '请选择小说文件' }}
    </h2>

    <!-- 内容区域容器，需要设置高度并允许滚动 -->
    <!-- flex-grow 让其占据剩余空间，overflow-y-auto 让其内部内容溢出时出现垂直滚动条 -->
    <!-- **修改点：移除虚拟列表，使用 v-for** -->
    <div ref="contentContainerRef" class="flex-grow overflow-y-auto text-xl">
      <!-- 使用 v-for 遍历章节内容行 -->
      <!-- bookStore.currentChapterLines 是按行分割的数组 -->
      <!-- key 绑定到 index 可以帮助 Vue 更好地管理列表元素 -->
      <!-- indent-lg 是 UnoCSS 原子类，用于首行缩进 -->
      <p
        v-for="(line, index) in bookStore.currentChapterLines"
        :key="index"
        class="my-2 indent-lg"
      >
        {{ line }}
      </p>
      <!-- **修改点：结束 v-for 渲染** -->
    </div>
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import { useBookStore } from '../stores/bookStore'
  // **修改点：移除对 NVirtualList 的导入**
  // import { NVirtualList } from 'naive-ui'

  const bookStore = useBookStore()

  // **新增点：获取内容容器的引用，用于滚动**
  const contentContainerRef = ref(null)

  // 监听当前章节索引的变化
  watch(
    () => bookStore.currentChapterIndex,
    (newIndex, oldIndex) => {
      console.log(`章节从索引 ${oldIndex} 切换到 ${newIndex}`)

      // **修改点：滚动内容容器到顶部**
      // 当章节变化时，将可滚动的 div 容器滚动到顶部
      if (contentContainerRef.value) {
        contentContainerRef.value.scrollTop = 0
        console.log('内容区域已滚动到顶部')
      }
    },
    {
      immediate: true, // 初始加载时执行
      // flush: 'post', // **修改点：不再需要 post flush，因为不是虚拟列表**
    },
  )

  // **修改点：移除对 virtualListRef 的引用和相关逻辑**
  // const virtualListRef = ref(null)
  // watch(
  //   () => bookStore.currentChapterIndex,
  //   (newIndex, oldIndex) => {
  //     console.log(`章节从索引 ${oldIndex} 切换到 ${newIndex}`)
  //     if (virtualListRef.value) {
  //       virtualListRef.value.scrollTo({ position: 'top' })
  //       console.log('虚拟列表已滚动到顶部')
  //     }
  //   },
  //   {
  //     immediate: true,
  //     flush: 'post',
  //   },
  // )
</script>

<style scoped>
  /* 尽量避免在这里写样式 */
</style>
