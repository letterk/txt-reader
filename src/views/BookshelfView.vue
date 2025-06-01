<template>
  <div class="w-full flex flex-col py-8">
    <h1 class="mb-8 text-center text-4xl font-bold">我的书架</h1>

    <div class="mb-6 text-center">
      <input
        ref="fileInput"
        type="file"
        accept=".txt"
        style="display: none"
        @change="handleFileChange"
      />
      <button
        class="rounded bg-blue-500 px-6 py-3 text-lg text-white disabled:cursor-not-allowed hover:bg-blue-600 disabled:opacity-50"
        :disabled="bookshelfStore.isLoading"
        @click="triggerFileInput"
      >
        上传小说文件 (.txt)
      </button>

      <div v-if="bookshelfStore.isLoading" class="mt-4 text-blue-600">
        {{ bookshelfStore.uploadMessage }}
      </div>

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

    <div v-if="bookshelfStore.books.length > 0">
      <h2 class="mb-4 text-2xl font-semibold">已保存的书籍:</h2>
      <ul class="space-y-2">
        <li
          v-for="book in bookshelfStore.books"
          :key="book.id"
          class="flex items-center justify-between border border-gray-200 rounded p-4 shadow-sm dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <router-link
            :to="{ name: 'Reader', params: { bookId: book.id } }"
            class="flex-grow text-lg font-medium dark:text-white"
          >
            {{ book.bookTitle }}
          </router-link>
          <button
            class="ml-4 text-red-500 disabled:cursor-not-allowed hover:text-red-700 disabled:opacity-50"
            :disabled="bookshelfStore.isLoading"
            @click="bookshelfStore.deleteBook(book.id)"
          >
            删除
          </button>
        </li>
      </ul>
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
    <div
      v-else-if="!bookshelfStore.isLoading"
      class="text-center text-gray-500"
    >
      书架是空的，快上传一本小说吧！
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'

  import { useBookshelfLogic } from '../composables/useBookshelfLogic'

  const { bookshelfStore, handleFileChange } = useBookshelfLogic()

  const fileInput = ref(null)
  const triggerFileInput = () => {
    fileInput.value.click()
  }
  document.title = '我的书架 - 简单小说阅读器'
</script>
