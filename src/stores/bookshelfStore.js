import { defineStore } from 'pinia'

import {
  getAllBookTitles,
  addBook as dbAddBook,
  deleteBookById,
  clearBooks,
} from '../utils/database'

import { parseBookText } from '../utils/parser'

import { useBookStore } from './bookStore'

export const useBookshelfStore = defineStore('bookshelf', {
  state: () => ({
    books: [],
    isLoading: false,
    isBooksCached: false,
    uploadMessage: '',
    uploadMessageType: '',
  }),

  actions: {
    setLoading(isLoading) {
      this.isLoading = isLoading
    },

    setUploadMessage(message, type = '') {
      this.uploadMessage = message
      this.uploadMessageType = type
    },

    clearUploadMessage() {
      this.uploadMessage = ''
      this.uploadMessageType = ''
    },

    async fetchBooks() {
      if (this.isBooksCached) return
      this.setLoading(true)
      try {
        const allBookTitles = await getAllBookTitles()
        this.books = allBookTitles
        this.isBooksCached = true
      } catch (error) {
        console.error('获取书架列表失败:', error)
        this.setUploadMessage('获取书架列表失败。', 'error')
      } finally {
        this.setLoading(false)
      }
    },

    async addBook(file) {
      if (this.isLoading) return

      this.setLoading(true)
      this.setUploadMessage('正在读取文件...')

      try {
        if (!file.name.endsWith('.txt')) {
          this.setUploadMessage('请选择 .txt 格式的小说文件。', 'error')
          return
        }

        const reader = new FileReader()
        const fileContent = await new Promise((resolve, reject) => {
          reader.onload = (event) => resolve(event.target.result)
          reader.onerror = (error) => reject(error)
          reader.readAsText(file, 'UTF-8')
        })

        this.setUploadMessage('文件读取成功，正在解析...')

        const chapters = parseBookText(fileContent)
        const bookTitle =
          (file.name.match(/《(.*?)》/) ?? [])[1] ??
          file.name.replace(/\.txt$/, '')

        if (chapters.length === 0) {
          this.setUploadMessage('未解析到任何章节，请检查文件格式。', 'error')
          return
        }

        const bookData = {
          bookTitle: bookTitle,
          chapters: chapters,
          uploadTime: new Date().toISOString(),
        }

        const bookId = await dbAddBook(bookData, fileContent)

        console.log(`书籍《${bookTitle}》保存成功，ID: ${bookId}`)
        this.setUploadMessage(`书籍《${bookTitle}》上传并保存成功！`, 'success')

        this.isBooksCached = false
        await this.fetchBooks()
      } catch (error) {
        console.error('处理文件失败:', error)
        if (error.isDuplicate) {
          this.setUploadMessage(error.message, 'error')
        } else {
          this.setUploadMessage(`文件处理失败: ${error.message}`, 'error')
        }
      } finally {
        this.setLoading(false)

        setTimeout(() => {
          this.clearUploadMessage()
        }, 5000)
      }
    },

    async deleteBook(bookId) {
      if (this.isLoading) return

      if (confirm('确定要删除这本书籍吗？')) {
        this.setLoading(true)
        try {
          await deleteBookById(bookId)
          console.log(`书籍 ID ${bookId} 删除成功`)

          this.isBooksCached = false
          await this.fetchBooks()
          const bookStore = useBookStore()

          if (
            bookStore.bookTitle &&
            bookStore.chapters.length > 0 &&
            bookStore.chapters[0]?.bookId === bookId
          ) {
            bookStore.setBookData('', [])
          }
        } catch (error) {
          console.error(`删除书籍 ID ${bookId} 失败:`, error)
          this.setUploadMessage('删除书籍失败。', 'error')
        } finally {
          this.setLoading(false)
          setTimeout(() => {
            this.clearUploadMessage()
          }, 3000)
        }
      }
    },

    async clearAllBooks() {
      if (this.isLoading) return

      if (confirm('确定要清空整个书架吗？这将无法撤销！')) {
        this.setLoading(true)
        try {
          await clearBooks()
          console.log('书架已清空')

          this.books = []

          const bookStore = useBookStore()
          bookStore.setBookData('', [])

          this.setUploadMessage('书架已清空。', 'success')
        } catch (error) {
          console.error('清空书架失败:', error)
          this.setUploadMessage('清空书架失败。', 'error')
        } finally {
          this.setLoading(false)
          setTimeout(() => {
            this.clearUploadMessage()
          }, 3000)
        }
      }
    },
  },
})
