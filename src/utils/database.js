import Dexie from 'dexie'
import { sha256 } from 'js-sha256'

import { slugify } from './slugify'

const db = new Dexie('NovelReaderDB')

db.version(1).stores({
  books: 'id, bookTitle, &contentHash',
})

export async function addBook(bookData, fileContent) {
  try {
    const contentHash = sha256(fileContent)

    const existingBookWithHash = await db.books
      .where('contentHash')
      .equals(contentHash)
      .first()

    if (existingBookWithHash) {
      const error = new Error(
        `书架中已存在内容相同的书籍：《${existingBookWithHash.bookTitle}》。`,
      )
      error.isDuplicate = true
      throw error
    }

    const baseId = slugify(bookData.bookTitle)
    let finalId = baseId
    let counter = 1

    let existingBookWithId = await db.books.get(finalId)
    while (existingBookWithId) {
      counter++
      finalId = `${baseId}-${counter}`
      existingBookWithId = await db.books.get(finalId)
    }

    const bookDataToSave = {
      ...bookData,
      id: finalId,
      contentHash: contentHash,
    }

    await db.books.add(bookDataToSave)

    return finalId
  } catch (error) {
    if (error.isDuplicate) {
      throw error
    }

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
  } catch (error) {
    console.error('清空 books 仓库失败:', error)
    throw error
  }
}
