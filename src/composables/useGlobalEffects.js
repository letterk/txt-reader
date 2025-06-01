import { ref, computed } from 'vue'
import { useBookStore } from '../stores/bookStore'

export function useGlobalEffects() {
  const bookStore = useBookStore()
  const theme = ref('dark')

  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  const isDrawerVisible = computed(() => bookStore.isDrawerVisible)

  return {
    theme,
    toggleTheme,
    isDrawerVisible,
  }
}
