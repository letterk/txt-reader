import { ref, watch } from 'vue'
import { useBookStore } from '../stores/bookStore'

export function useGlobalEffects() {
  const bookStore = useBookStore()

  const theme = ref('dark')

  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  watch(
    [() => bookStore.bookTitle, () => bookStore.currentChapter],
    ([newTitle, newChapter]) => {
      let pageTitle = '简单小说阅读器'
      if (newTitle) {
        pageTitle = newTitle

        if (newChapter && newChapter.title) {
          pageTitle += ` - ${newChapter.title}`
        }
      }
      document.title = pageTitle
    },
    { immediate: true },
  )

  return {
    theme,
    toggleTheme,
  }
}
