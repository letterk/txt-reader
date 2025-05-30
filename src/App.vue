<template>
  <div :class="theme === 'dark' ? 'dark' : 'light'" class="min-h-screen">
    <div class="mx-auto w-800px px-4">
      <router-view />
    </div>

    <!-- 主题切换按钮 -->
    <button
      class="fixed left-4 top-4 rounded bg-gray-200 px-3 py-1 text-xs dark:bg-gray-700 dark:text-white focus:outline-none"
      @click="toggleTheme"
    >
      切换主题
    </button>
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue'

  import { useBookStore } from './stores/bookStore'

  const bookStore = useBookStore()

  const theme = ref('dark')

  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  watch(
    [() => bookStore.bookTitle, () => bookStore.currentChapter],
    ([newTitle, newChapter]) => {
      let pageTitle = '简单小说阅读器'
      if (newTitle) {
        pageTitle = newTitle

        if (newChapter && newChapter.title) {
          pageTitle += ` - ${newChapter.title}`
        }
      }
      document.title = pageTitle
    },
    { immediate: true },
  )
</script>

<style>
  /* 全局样式，包括主题和滚动条 */
  /* 主题样式 */
  .light {
    background-color: #ffffff; /* 白色背景 */
    color: #000000; /* 黑色文字 */
  }

  .dark {
    background-color: #1e1e1e; /* 深色背景 */
    color: #e0e0e0; /* 浅色文字 */
  }

  /* ---------- 滚动条样式 ---------- */
  /* 这里的样式是全局的，但我们通过 #directory-drawer 限定只影响目录抽屉 */
  /* ReaderView 的内容现在是页面整体滚动，所以不需要为它单独设置滚动条样式 */
  /* 1. Webkit 浏览器（Chrome, Safari, Edge 等）滚动条样式 */
  #directory-drawer::-webkit-scrollbar {
    width: 8px; /* 设置垂直滚动条的宽度 */
  }

  /* 滚动条的轨道（背景） */
  #directory-drawer::-webkit-scrollbar-track {
    background: transparent; /* 默认透明，具体颜色在主题中设置 */
  }

  /* 滚动条的滑块（可以拖动的部分） */
  #directory-drawer::-webkit-scrollbar-thumb {
    background-color: #888; /* 默认滑块颜色 */
    border-radius: 4px; /* 滑块圆角 */
    /* 这里给滑块添加一个透明边框，可以让它看起来居中一些，与轨道之间有间隔 */
    border: 2px solid transparent;
    background-clip: content-box; /* 让背景只在内容区域显示，不包括边框 */
  }

  /* 滑块在鼠标悬停时的颜色 */
  #directory-drawer::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }

  /* 根据主题设置 Webkit 滚动条颜色 */
  .light #directory-drawer::-webkit-scrollbar-track {
    background: #f0f0f0; /* 亮色模式下的轨道颜色 */
  }
  .light #directory-drawer::-webkit-scrollbar-thumb {
    background-color: #888; /* 亮色模式下的滑块颜色 */
  }
  .light #directory-drawer::-webkit-scrollbar-thumb:hover {
    background-color: #555; /* 亮色模式下滑块悬停颜色 */
  }

  .dark #directory-drawer::-webkit-scrollbar-track {
    background: #333; /* 暗色模式下的轨道颜色 */
  }
  .dark #directory-drawer::-webkit-scrollbar-thumb {
    background-color: #555; /* 暗色模式下的滑块颜色 */
  }
  .dark #directory-drawer::-webkit-scrollbar-thumb:hover {
    background-color: #777; /* 暗色模式下滑块悬停颜色 */
  }

  /* 2. Firefox 浏览器滚动条样式 */
  /* 使用标准的 scrollbar-width 和 scrollbar-color 属性 */
  #directory-drawer {
    scrollbar-width: thin; /* 可以是 "auto", "thin", 或 "none" */
    /* scrollbar-color: <thumb-color> <track-color>; */
    scrollbar-color: #888 #f0f0f0; /* 默认颜色（会被下面的主题覆盖） */
  }

  /* 根据主题设置 Firefox 滚动条颜色 */
  .light #directory-drawer {
    scrollbar-color: #888 #f0f0f0; /* 亮色模式下的颜色 */
  }

  .dark #directory-drawer {
    scrollbar-color: #555 #333; /* 暗色模式下的颜色 */
  }
</style>
