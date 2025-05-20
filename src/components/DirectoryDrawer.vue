<!-- src/components/DirectoryDrawer.vue -->
<template>
  <n-drawer
    v-model:show="bookStore.isDrawerVisible"
    :width="300"
    placement="right"
    @update:show="handleDrawerUpdateShow"
  >
    <n-drawer-content title="目录">
      <!-- 目录列表将放在这里 -->
      <p>这里是目录内容</p>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup>
  // import { ref } from 'vue' // **修改点：不再需要 ref 来控制显示状态**
  import { NDrawer, NDrawerContent } from 'naive-ui'
  import { useBookStore } from '../stores/bookStore' // **新增点：导入 Pinia Store**

  // **新增点：获取 Pinia Store 实例**
  const bookStore = useBookStore()

  // **新增点：处理抽屉关闭的函数**
  // 当 n-drawer 的 v-model:show 值发生变化时，会触发 update:show 事件
  // 特别是当用户点击蒙层或按 Esc 关闭抽屉时，n-drawer 会将新的状态 (false) 传递过来
  // 我们需要确保 Store 中的状态也同步更新
  const handleDrawerUpdateShow = (show) => {
    // 如果抽屉变为隐藏状态 (show 是 false)
    if (!show) {
      // 调用 Store 的 action 来同步关闭状态
      bookStore.isDrawerVisible = false // 直接修改 state 也可以，因为是简单的 boolean
      // 或者调用 action 如果有更复杂的逻辑: bookStore.toggleDrawer()
    }
  }
</script>

<style scoped>
  /* 抽屉组件的样式 */
</style>
