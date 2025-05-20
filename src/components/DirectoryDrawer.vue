<!-- src/components/DirectoryDrawer.vue -->
<template>
  <n-drawer
    v-model:show="bookStore.isDrawerVisible"
    :width="300"
    placement="right"
    @update:show="handleDrawerUpdateShow"
  >
    <n-drawer-content title="目录">
      <!-- **新增点：使用 n-menu 组件** -->
      <n-menu
        :options="menuOptions"
        key-field="index"
        label-field="title"
        :value="currentMenuValue"
        @update:value="handleMenuUpdateValue"
      />
    </n-drawer-content>
  </n-drawer>
</template>

<script setup>
  import { computed } from 'vue' // **新增点：导入 computed**
  import { NDrawer, NDrawerContent, NMenu } from 'naive-ui' // **新增点：导入 NMenu**
  import { useBookStore } from '../stores/bookStore'

  const bookStore = useBookStore()

  // **新增点：计算菜单选项**
  // 菜单组件需要一个特定的 options 数组格式
  // 每个选项通常需要一个 key, label (显示的文本), 和 value
  // 我们使用 Store 中的 chaptersListForNav getter 来生成这个数组
  const menuOptions = computed(() => {
    // Pinia Store 的 chaptersListForNav 已经处理了大部分逻辑
    // 它返回 [{ id: ..., title: ..., index: ... }]
    // Naive UI 的 n-menu 需要 keyField 和 labelField 来指定使用哪个属性
    // 我们将 keyField 设为 'index' (便于选中和跳转)，labelField 设为 'title' (显示章节标题)
    return bookStore.chaptersListForNav
  })

  // **新增点：计算当前菜单项的值**
  // n-menu 的 value 属性用于控制哪个菜单项被“选中”并高亮
  // 我们希望高亮当前阅读的章节对应的菜单项
  // Store 中的 currentChapterIndex 就是当前章节的索引，这正好可以作为 value
  const currentMenuValue = computed(() => {
    // 确保 chaptersListForNav 数组存在且当前索引有效
    if (
      bookStore.chaptersListForNav.length > 0 &&
      bookStore.currentChapterIndex >= 0
    ) {
      // 返回当前章节对应的 menuOptions 数组中的 index
      // 因为我们在 menuOptions 中保留了 index 属性，并且将 key-field 和 value 都设置为 index，
      // 所以这里的 value 就是当前章节的索引
      return bookStore.currentChapterIndex
    }
    return null // 没有章节时返回 null
  })

  // 处理抽屉关闭的函数
  const handleDrawerUpdateShow = (show) => {
    if (!show) {
      bookStore.isDrawerVisible = false
    }
  }

  // **新增点：处理菜单项点击的函数**
  // 当用户点击 n-menu 中的一个选项时，@update:value 事件会触发
  // n-menu 会将点击的选项的 value (我们这里是章节索引) 作为参数传递进来
  const handleMenuUpdateValue = (key) => {
    // key 就是我们设置的 key-field 对应的值，也就是章节索引
    console.log(`菜单项点击：跳转到章节索引 ${key}`)
    // 调用 Store 的 action 来跳转章节
    bookStore.goToChapter(key)
    // 跳转后关闭抽屉
    bookStore.toggleDrawer()
  }
</script>

<style scoped>
  /* 抽屉组件的样式 */
</style>
