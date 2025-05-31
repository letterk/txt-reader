import { onMounted } from 'vue'
import { useBookshelfStore } from '../stores/bookshelfStore'
import { useBookStore } from '../stores/bookStore'

export function useBookshelfLogic() {
  const bookshelfStore = useBookshelfStore()
  const bookStore = useBookStore()

  const handleFileChange = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    event.target.value = ''

    await bookshelfStore.addBook(file)
  }

  onMounted(() => {
    bookshelfStore.fetchBooks()

    bookStore.isDrawerVisible = false
  })

  return {
    bookshelfStore,
    handleFileChange,
  }
}
