import Dexie from 'dexie'

const db = new Dexie('NovelReaderDB')

db.version(1).stores({
  books: '++id, bookTitle',
})

export async function addBook(bookData) {
  try {
    const id = await db.books.add(bookData)
    return id
  } catch (error) {
    console.error('添加书籍失败:', error)
    throw error
  }
}

export async function getAllBooks() {
  try {
    const books = await db.books.toArray()
    return books
  } catch (error) {
    console.error('获取书籍列表失败:', error)
    throw error
  }
}

export async function getBookById(id) {
  try {
    const book = await db.books.get(id)
    return book
  } catch (error) {
    console.error(`根据 ID ${id} 获取书籍失败:`, error)
    throw error
  }
}

export async function deleteBookById(id) {
  try {
    await db.books.delete(id)
  } catch (error) {
    console.error(`删除书籍 ID ${id} 失败:`, error)
    throw error
  }
}

export async function clearBooks() {
  try {
    await db.books.clear()
    console.log('已清空 books 仓库')
  } catch (error) {
    console.error('清空 books 仓库失败:', error)
    throw error
  }
}
