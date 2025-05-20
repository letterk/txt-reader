<!-- src/components/DirectoryDrawer.vue -->
<template>
  <!-- 这里我们将使用 Naive UI 的 n-drawer 组件 -->
  <n-drawer v-model:show="showDrawer" :width="300" placement="right">
    <!-- 抽屉内部的内容区域 -->
    <n-drawer-content title="目录">
      <!-- 目录列表将放在这里 -->
      <p>这里是目录内容</p>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup>
  import { ref } from 'vue'
  import { NDrawer, NDrawerContent } from 'naive-ui'

  // 我们需要一个响应式变量来控制抽屉的显示/隐藏
  const showDrawer = ref(false)

  // 为了在 App.vue 中使用这个组件并控制它，我们需要把 showDrawer 暴露出去
  // 但是更好的方式是通过 Pinia Store 来管理状态，稍后我们会改动这里。
</script>

<style scoped>
  /* 抽屉组件的样式，通常由 Naive UI 控制 */
</style>
