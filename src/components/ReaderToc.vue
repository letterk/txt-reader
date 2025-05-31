<template>
  <div
    id="directory-drawer"
    :class="{
      'transform translate-x-0': bookStore.isDrawerVisible,
      'transform -translate-x-full': !bookStore.isDrawerVisible,
    }"
    class="fixed inset-y-0 left-0 z-1 w-300px overflow-y-auto bg-white shadow-lg transition-transform duration-300 ease-in-out dark:bg-gray-800"
  >
    <div class="border-b border-gray-200 p-4 dark:border-gray-700">
      <h2 class="text-lg font-bold dark:text-white">
        {{ bookStore.bookTitle || '目录' }}
      </h2>
    </div>

    <ul class="flex flex-col">
      <li
        v-for="item in bookStore.chaptersListForNav"
        :id="`chapter-item-${item.id}`"
        :key="item.id"
        :class="{
          'bg-blue-100 dark:bg-blue-900':
            item.id === bookStore.currentChapterId,
          'hover:bg-gray-100 dark:hover:bg-gray-700':
            item.id !== bookStore.currentChapterId,
        }"
        class="cursor-pointer px-4 py-2 text-gray-800 dark:text-gray-200"
        @click="handleChapterClick(item.id)"
      >
        {{ item.title }}
      </li>
    </ul>
  </div>

  <div
    v-if="bookStore.isDrawerVisible"
    class="fixed inset-0 bg-black bg-opacity-50"
    @click="bookStore.toggleDrawer()"
  ></div>
</template>

<script setup>
  import { watch, nextTick } from 'vue'
  import { useBookStore } from '../stores/bookStore'

  const bookStore = useBookStore()

  const handleChapterClick = (chapterId) => {
    bookStore.goToChapterById(chapterId)
    bookStore.toggleDrawer()

    nextTick(() => {
      scrollToCurrentChapter()
    })
  }

  const scrollToCurrentChapter = () => {
    if (
      bookStore.currentChapterId !== null &&
      bookStore.chaptersListForNav.length > 0
    ) {
      nextTick(() => {
        const itemId = `chapter-item-${bookStore.currentChapterId}`
        const element = document.getElementById(itemId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        } else {
          console.warn(
            `未找到章节元素: ${itemId} 对应 ID ${bookStore.currentChapterId}`,
          )
        }
      })
    }
  }

  watch(
    () => bookStore.currentChapterId,
    (newId, oldId) => {
      if (newId !== oldId && bookStore.isDrawerVisible) {
        scrollToCurrentChapter()
      }
    },
  )

  watch(
    () => bookStore.isDrawerVisible,
    (isVisible) => {
      if (isVisible) {
        scrollToCurrentChapter()
      }
    },
  )
</script>

<style scoped>
  #directory-drawer {
    scrollbar-width: thin;
  }

  .light #directory-drawer {
    scrollbar-color: #c2c2c2 #f0f0f0;
  }

  .dark #directory-drawer {
    scrollbar-color: #555 #333;
  }
</style>
