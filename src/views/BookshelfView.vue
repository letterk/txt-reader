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
        :disabled="bookStore.isLoading"
        @click="triggerFileInput"
      >
        上传小说文件 (.txt)
      </button>

      <!-- 文件上传过程中的加载提示 -->
      <div v-if="bookStore.isLoading" class="mt-4 text-blue-600">
        正在加载文件并解析...
      </div>
      <!-- 上传成功或失败的提示 -->
      <div
        v-if="uploadMessage"
        class="mt-4 text-sm"
        :class="
          uploadMessageType === 'success' ? 'text-green-600' : 'text-red-600'
        "
      >
        {{ uploadMessage }}
      </div>
    </div>

    <!-- 书籍列表 -->
    <div v-if="books.length > 0">
      <h2 class="mb-4 text-2xl font-semibold">已保存的书籍:</h2>
      <ul class="space-y-2">
        <!-- 遍历书架列表，显示每一本书 -->
        <li
          v-for="book in books"
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
            :disabled="bookStore.isLoading"
            @click="deleteBook(book.id)"
          >
            删除
          </button>
        </li>
      </ul>
      <!-- 清空书架按钮 -->
      <div class="mt-8 text-center">
        <button
          class="rounded bg-red-500 px-4 py-2 text-white disabled:cursor-not-allowed hover:bg-red-600 disabled:opacity-50"
          :disabled="bookStore.isLoading"
          @click="clearAllBooks"
        >
          清空书架
        </button>
      </div>
    </div>
    <div v-else-if="!bookStore.isLoading" class="text-center text-gray-500">
      书架是空的，快上传一本小说吧！
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'

  import {
    getAllBooks,
    addBook,
    deleteBookById,
    clearBooks,
  } from '../utils/database'

  import { parseBookText } from '../utils/parser'

  import { useBookStore } from '../stores/bookStore'

  const bookStore = useBookStore()

  const fileInput = ref(null)

  const books = ref([])

  const uploadMessage = ref('')

  const uploadMessageType = ref('')

  const triggerFileInput = () => {
    fileInput.value.click()
  }

  const handleFileChange = async (event) => {
    const file = event.target.files[0]

    if (!file) return

    bookStore.setLoading(true)

    uploadMessage.value = '正在读取文件...'
    uploadMessageType.value = ''

    event.target.value = ''

    try {
      if (!file.name.endsWith('.txt')) {
        uploadMessage.value = '请选择 .txt 格式的小说文件。'
        uploadMessageType.value = 'error'
        return
      }

      const reader = new FileReader()

      const fileContent = await new Promise((resolve, reject) => {
        reader.onload = (event) => {
          resolve(event.target.result)
        }
        reader.onerror = (error) => {
          reject(error)
        }
        reader.readAsText(file, 'UTF-8')
      })

      uploadMessage.value = '文件读取成功，正在解析...'

      const chapters = parseBookText(fileContent)

      const bookTitle =
        (file.name.match(/《(.*?)》/) ?? [])[1] ??
        file.name.replace(/\.txt$/, '')

      if (chapters.length === 0) {
        uploadMessage.value = '未解析到任何章节，请检查文件格式。'
        uploadMessageType.value = 'error'
        return
      }

      const bookData = {
        bookTitle: bookTitle,
        chapters: chapters,
        uploadTime: new Date().toISOString(),
      }

      const bookId = await addBook(bookData, fileContent)

      console.log(`书籍《${bookTitle}》保存成功，ID: ${bookId}`)
      uploadMessage.value = `书籍《${bookTitle}》上传并保存成功！`
      uploadMessageType.value = 'success'

      await fetchBooks()
    } catch (error) {
      console.error('处理文件失败:', error)

      if (error.isDuplicate) {
        uploadMessage.value = error.message
        uploadMessageType.value = 'error'
      } else {
        uploadMessage.value = `文件处理失败: ${error.message}`
        uploadMessageType.value = 'error'
      }
    } finally {
      bookStore.setLoading(false)

      setTimeout(() => {
        uploadMessage.value = ''
        uploadMessageType.value = ''
      }, 5000)
    }
  }

  const fetchBooks = async () => {
    try {
      const allBooks = await getAllBooks()
      books.value = allBooks
    } catch (error) {
      console.error('获取书架列表失败:', error)
    }
  }

  const deleteBook = async (bookId) => {
    if (confirm('确定要删除这本书籍吗？')) {
      try {
        await deleteBookById(bookId)
        console.log(`书籍 ID ${bookId} 删除成功`)

        await fetchBooks()

        if (
          bookStore.bookTitle &&
          bookStore.chapters.length > 0 &&
          bookStore.chapters[0]?.bookId === bookId
        ) {
          bookStore.setBookData('', [])
        }
      } catch (error) {
        console.error(`删除书籍 ID ${bookId} 失败:`, error)
        alert('删除书籍失败。')
      }
    }
  }

  const clearAllBooks = async () => {
    if (confirm('确定要清空整个书架吗？这将无法撤销！')) {
      try {
        await clearBooks()
        console.log('书架已清空')

        await fetchBooks()

        bookStore.setBookData('', [])
      } catch (error) {
        console.error('清空书架失败:', error)
        alert('清空书架失败。')
      }
    }
  }

  onMounted(() => {
    console.log('BookshelfView 组件已挂载，正在获取书架列表...')

    fetchBooks()

    bookStore.setBookData('', [])

    bookStore.isDrawerVisible = false
  })
</script>

<style scoped>
  /* 只应用于此组件的样式 */
</style>
