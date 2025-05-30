export function setupKeyboardListener(bookStore, isLoadingRef) {
  const handleKeyDown = (event) => {
    if (isLoadingRef.value) {
      return
    }

    if (bookStore.chapters.length === 0 && event.key !== 'Enter') {
      return
    }

    switch (event.key) {
      case 'ArrowLeft':
        bookStore.goToPrevChapter()
        event.preventDefault()
        break

      case 'ArrowRight':
        bookStore.goToNextChapter()
        event.preventDefault()
        break

      case 'Enter':
        bookStore.toggleDrawer()
        event.preventDefault()
        break

      default:
        break
    }
  }

  window.addEventListener('keydown', handleKeyDown)

  const cleanup = () => {
    window.removeEventListener('keydown', handleKeyDown)
  }

  return cleanup
}
