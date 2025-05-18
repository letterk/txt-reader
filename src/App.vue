<template>
  <div>
    <h1>简单小说阅读器</h1>

    <!-- 文件输入元素，隐藏起来 -->
    <input type="file" ref="fileInput" @change="handleFileChange" accept=".txt" style="display: none;" />

    <!-- 按钮，点击时触发文件输入元素的点击事件 -->
    <n-button @click="triggerFileInput" :disabled="bookStore.isLoading">
      {{ bookStore.isLoading ? '正在加载...' : '选择小说文件' }}
    </n-button>

    <!-- 显示书名 -->
    <h2 v-if="bookStore.bookTitle">{{ bookStore.bookTitle }}</h2>

    <!-- 阅读区域和底部导航将在后面添加 -->
    <!-- <ReaderView /> -->
    <!-- <BottomNav /> -->

    <!-- 目录抽屉也将在后面添加 -->
    <!-- <DirectoryDrawer /> -->

    <!-- 加载指示器 -->
    <n-spin :show="bookStore.isLoading">
      <!-- 如果isLoading为true，n-spin会显示加载动画并遮罩其内容 -->
      <!-- 阅读区域和底部导航可以放在这里面，表示在加载时这些区域被遮罩 -->
      <div v-if="bookStore.bookTitle">
        <!-- 这里是主要内容区域，比如你的 ReaderView 组件 -->
        <p>这里是显示当前章节内容的地方 (暂时)</p>
        <p>当前章节索引: {{ bookStore.currentChapterIndex }}</p>
        <p>当前章节标题: {{ bookStore.currentChapter?.title || '无' }}</p>
        <!-- <ReaderView /> -->
      </div>
    </n-spin>


  </div>
</template>

<script setup>
import { NButton, NSpin } from 'naive-ui'; // 导入 Naive UI 组件
import { ref } from 'vue';
import { useBookStore } from './stores/bookStore'; // 导入 store

const fileInput = ref(null); // 用于引用隐藏的文件输入元素
const bookStore = useBookStore(); // 获取 store 实例

// 触发文件输入元素的点击事件，打开文件选择对话框
const triggerFileInput = () => {
  fileInput.value.click();
};

// 文件选择后触发的事件处理函数
const handleFileChange = (event) => {
  const file = event.target.files[0]; // 获取用户选择的第一个文件
  if (file) {
    console.log('选择了文件:', file.name);
    // 调用 store 的 loadBook action 来处理文件加载和解析
    // 我们将在 store 中实现 loadBook action
    bookStore.loadBook(file);
  }
};

// TODO: 在 store 中实现 loadBook action
// TODO: 添加 ReaderView, BottomNav, DirectoryDrawer 组件
</script>

<style scoped>
/* 可以添加一些基本样式，但尽量依赖 Naive UI */
div {
  text-align: center;
  padding: 20px;
}
</style>