import { defineStore } from 'pinia'
import { ref } from 'vue'

import {
  getAllBookTitles,
  addBook as dbAddBook,
  deleteBookById,
  clearBooks,
} from '../utils/database'

import { parseBookText } from '../utils/parser'

import { useBookStore } from './bookStore'

export const useBookshelfStore = defineStore('bookshelf', () => {
  const books = ref([])
  const isLoading = ref(false)
  const isBooksCached = ref(false)
  const uploadMessage = ref('')
  const uploadMessageType = ref('')

  function setLoading(loading) {
    isLoading.value = loading
  }

  function setUploadMessage(message, type = '') {
    uploadMessage.value = message
    uploadMessageType.value = type
  }

  function clearUploadMessage() {
    uploadMessage.value = ''
    uploadMessageType.value = ''
  }

  async function fetchBooks() {
    if (isBooksCached.value) return
    setLoading(true)
    try {
      const allBookTitles = await getAllBookTitles()
      books.value = allBookTitles
      isBooksCached.value = true
    } catch (error) {
      console.error('获取书架列表失败:', error)
      setUploadMessage('获取书架列表失败。', 'error')
    } finally {
      setLoading(false)
    }
  }

  async function addBook(file) {
    if (isLoading.value) return

    setLoading(true)
    setUploadMessage('正在读取文件...')

    try {
      if (!file.name.endsWith('.txt')) {
        setUploadMessage('请选择 .txt 格式的小说文件。', 'error')
        return
      }

      const reader = new FileReader()
      const fileContent = await new Promise((resolve, reject) => {
        reader.onload = (event) => resolve(event.target.result)
        reader.onerror = (error) => reject(error)
        reader.readAsText(file, 'UTF-8')
      })

      setUploadMessage('文件读取成功，正在解析...')

      const chapters = parseBookText(fileContent)
      const bookTitle =
        (file.name.match(/《(.*?)》/) ?? [])[1] ??
        file.name.replace(/\.txt$/, '')

      if (chapters.length === 0) {
        setUploadMessage('未解析到任何章节，请检查文件格式。', 'error')
        return
      }

      const bookData = {
        bookTitle: bookTitle,
        chapters: chapters,
        uploadTime: new Date().toISOString(),
      }

      await dbAddBook(bookData, fileContent)

      setUploadMessage(`书籍《${bookTitle}》上传并保存成功！`, 'success')

      isBooksCached.value = false
      await fetchBooks()
    } catch (error) {
      console.error('处理文件失败:', error)
      if (error.isDuplicate) {
        setUploadMessage(error.message, 'error')
      } else {
        setUploadMessage(`文件处理失败: ${error.message}`, 'error')
      }
    } finally {
      setLoading(false)

      setTimeout(() => {
        clearUploadMessage()
      }, 5000)
    }
  }

  async function deleteBook(bookId) {
    if (isLoading.value) return

    if (confirm('确定要删除这本书籍吗？')) {
      setLoading(true)
      try {
        await deleteBookById(bookId)

        isBooksCached.value = false
        await fetchBooks()
        const bookStore = useBookStore()

        if (
          bookStore.bookTitle &&
          bookStore.chapters.some((c) => c.bookId === bookId)
        ) {
          bookStore.clearBookData()
        }
      } catch (error) {
        console.error(`删除书籍 ID ${bookId} 失败:`, error)
        setUploadMessage('删除书籍失败。', 'error')
      } finally {
        setLoading(false)
        setTimeout(() => {
          clearUploadMessage()
        }, 3000)
      }
    }
  }

  async function clearAllBooks() {
    if (isLoading.value) return

    if (confirm('确定要清空整个书架吗？这将无法撤销！')) {
      setLoading(true)
      try {
        await clearBooks()

        books.value = []
        isBooksCached.value = false

        const bookStore = useBookStore()
        setUploadMessage('书架已清空。', 'success')

        bookStore.clearBookData()
      } catch (error) {
        console.error('清空书架失败:', error)
        setUploadMessage('清空书架失败。', 'error')
      } finally {
        setLoading(false)
        setTimeout(() => {
          clearUploadMessage()
        }, 3000)
      }
    }
  }

  return {
    books,
    isLoading,
    uploadMessage,
    uploadMessageType,

    setLoading,
    setUploadMessage,
    clearUploadMessage,
    fetchBooks,
    addBook,
    deleteBook,
    clearAllBooks,
  }
})
