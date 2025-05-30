<template>
  <!-- 书架页面的最外层容器 -->
  <div class="w-full flex flex-col py-8">
    <!-- 页面标题 -->
    <h1 class="mb-8 text-center text-4xl font-bold">我的书架</h1>

    <!-- 文件选择区域 -->
    <div class="mb-6 text-center">
      <!-- 隐藏的文件输入框 -->
      <input
        ref="fileInput"
        type="file"
        accept=".txt"
        style="display: none"
        @change="handleFileChange"
      />
      <!-- 触发文件选择的按钮 -->
      <button
        class="rounded bg-blue-500 px-6 py-3 text-lg text-white disabled:cursor-not-allowed hover:bg-blue-600 disabled:opacity-50"
        :disabled="bookshelfStore.isLoading"
        @click="triggerFileInput"
      >
        上传小说文件 (.txt)
      </button>

      <!-- 文件上传过程中的加载提示 -->
      <!-- 使用 bookshelfStore.isLoading -->
      <div v-if="bookshelfStore.isLoading" class="mt-4 text-blue-600">
        <!-- 根据 uploadMessage 显示具体提示 -->
        {{ bookshelfStore.uploadMessage || '正在处理文件...' }}
      </div>
      <!-- 上传成功或失败的提示 -->
      <!-- 使用 bookshelfStore 的提示状态 -->
      <div
        v-if="bookshelfStore.uploadMessage && !bookshelfStore.isLoading"
        class="mt-4 text-sm"
        :class="
          bookshelfStore.uploadMessageType === 'success'
            ? 'text-green-600'
            : 'text-red-600'
        "
      >
        {{ bookshelfStore.uploadMessage }}
      </div>
    </div>

    <!-- 书籍列表 -->
    <!-- 使用 bookshelfStore.books -->
    <div v-if="bookshelfStore.books.length > 0">
      <h2 class="mb-4 text-2xl font-semibold">已保存的书籍:</h2>
      <ul class="space-y-2">
        <!-- 遍历书架列表，显示每一本书 -->
        <!-- 使用 bookshelfStore.books -->
        <li
          v-for="book in bookshelfStore.books"
          :key="book.id"
          class="flex items-center justify-between border border-gray-200 rounded p-4 shadow-sm dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <!-- 书名，点击后跳转到阅读页面 -->
          <!-- 使用 book.id 作为路由参数 -->
          <router-link
            :to="{ name: 'Reader', params: { bookId: book.id } }"
            class="flex-grow text-lg font-medium dark:text-white"
          >
            {{ book.bookTitle }}
          </router-link>
          <!-- 删除按钮 -->
          <button
            class="ml-4 text-red-500 disabled:cursor-not-allowed hover:text-red-700 disabled:opacity-50"
            :disabled="bookshelfStore.isLoading"
            @click="bookshelfStore.deleteBook(book.id)"
          >
            删除
          </button>
        </li>
      </ul>
      <!-- 清空书架按钮 -->
      <div class="mt-8 text-center">
        <button
          class="rounded bg-red-500 px-4 py-2 text-white disabled:cursor-not-allowed hover:bg-red-600 disabled:opacity-50"
          :disabled="bookshelfStore.isLoading"
          @click="bookshelfStore.clearAllBooks()"
        >
          清空书架
        </button>
      </div>
    </div>
    <!-- 使用 bookshelfStore.isLoading -->
    <div
      v-else-if="!bookshelfStore.isLoading"
      class="text-center text-gray-500"
    >
      书架是空的，快上传一本小说吧！
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'

  import { useBookshelfStore } from '../stores/bookshelfStore'

  import { useBookStore } from '../stores/bookStore'

  const bookshelfStore = useBookshelfStore()
  const bookStore = useBookStore()

  const fileInput = ref(null)

  const triggerFileInput = () => {
    fileInput.value.click()
  }

  const handleFileChange = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    event.target.value = ''

    await bookshelfStore.addBook(file)
  }

  onMounted(() => {
    console.log('BookshelfView 组件已挂载，正在获取书架列表...')

    bookshelfStore.fetchBooks()

    bookStore.setBookData('', [])

    bookStore.isDrawerVisible = false
  })
</script>

<style scoped>
  /* 只应用于此组件的样式 */
</style>
