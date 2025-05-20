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

    <!-- 虚拟列表容器，需要设置高度并允许滚动 -->
    <!-- flex-grow 让其占据剩余空间，overflow-y-auto 让其内部内容溢出时出现垂直滚动条 -->
    <div class="flex-grow overflow-y-auto">
      <!-- 使用 n-virtual-list -->
      <n-virtual-list
        ref="virtualListRef"
        :items="chapterLines"
        :item-size="24"
        item-resizable
        key-field="index"
        class="text-xl"
      >
        <template #default="{ index, item }">
          <p :key="index" class="my-2 indent-lg">
            {{ item }}
          </p>
        </template>
      </n-virtual-list>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, watch } from 'vue' // 引入 ref, computed, watch
  import { useBookStore } from '../stores/bookStore' // 导入 store
  import { NVirtualList } from 'naive-ui' // 导入 Naive UI 组件，包括 NVirtualList

  const bookStore = useBookStore() // 获取 store 实例

  // 将当前章节内容按行分割
  // 确保过滤掉空行
  const chapterLines = computed(() => {
    const content = bookStore.currentChapterContent
    // 如果内容存在，按行分割，并过滤掉只有空白字符的行，否则返回空数组
    return content
      ? content.split('\n').filter((line) => line.trim() !== '')
      : []
  })

  // 创建一个 ref 来引用虚拟列表组件实例
  const virtualListRef = ref(null)

  // 监听当前章节索引的变化
  watch(
    () => bookStore.currentChapterIndex,
    (newIndex, oldIndex) => {
      // 当章节索引变化时执行
      console.log(`章节从索引 ${oldIndex} 切换到 ${newIndex}`)

      // 确保虚拟列表组件已经渲染并且获取到了引用
      if (virtualListRef.value) {
        // 使用 scrollTo 方法滚动到列表顶部
        virtualListRef.value.scrollTo({ position: 'top' })
        console.log('虚拟列表已滚动到顶部')
      }
    },
    {
      immediate: true, // 初始加载时执行
      flush: 'post', // 在 DOM 更新后执行 watch 回调，确保虚拟列表已经渲染
    },
  )
</script>

<style scoped>
  /* 尽量避免在这里写样式 */
  /* Naive UI 组件自带样式，UnoCSS 原子类直接在 class 中 */
</style>
