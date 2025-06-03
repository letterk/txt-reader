export function setupKeyboardListener(
  bookStore,
  isLoadingRef,
  router,
  isSettingsVisibleRef,
) {
  const handleKeyDown = (event) => {
    if (isLoadingRef.value || isSettingsVisibleRef.value) {
      return
    }

    if (
      bookStore.chapters.length === 0 &&
      event.key !== 'Enter' &&
      event.key.toLowerCase() !== 'b'
    ) {
      return
    }

    switch (event.key.toLowerCase()) {
      case 'arrowleft':
        bookStore.goToPrevChapter()
        event.preventDefault()
        break

      case 'arrowright':
        bookStore.goToNextChapter()
        event.preventDefault()
        break

      case 'enter':
        bookStore.toggleDrawer()
        event.preventDefault()
        break

      case 'b':
        if (router && router.currentRoute.value.name === 'Reader') {
          router.replace({ name: 'Bookshelf' })
          event.preventDefault()
        }
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
