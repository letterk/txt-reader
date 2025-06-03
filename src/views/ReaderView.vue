<template>
  <div
    ref="readerContainerRef"
    class="mx-auto flex flex-col"
    :style="{ width: `${settingsStore.readerWidth}px` }"
  >
    <div
      v-for="chapter in bookStore.displayedChaptersContent"
      :id="`chapter-content-${chapter.id}`"
      :key="chapter.id"
      :data-chapter-id="chapter.id"
      class="chapter-block"
      :style="{
        fontFamily: settingsStore.fontFamily,
        fontSize: `${settingsStore.fontSize}px`,
      }"
    >
      <p class="my-8 mb-1em text-2em">
        {{ chapter.title }}
      </p>
      <p
        v-for="(line, index) in chapter.lines"
        :key="index"
        class="indent-2em"
        :style="{
          lineHeight: settingsStore.lineHeight,
          marginBottom: `${settingsStore.marginBottom}em`,
        }"
      >
        {{ line.text }}
      </p>
    </div>

    <div
      v-if="!isLoadingInitial && bookStore.canLoadMoreChaptersForward"
      ref="nextChapterSentinelRef"
      class="h-10"
    ></div>
    <div v-if="isLoadingMore" class="py-4 text-center">正在加载更多章节...</div>
  </div>

  <div class="text-l fixed right-20 top-10% m-5 flex flex-col gap-2 opacity-60">
    <button
      class="rounded px-10 py-2 hover:bg-gray-100 focus:outline-none dark:hover:bg-gray-700"
      @click="goToBookshelf"
    >
      书架
    </button>
    <button
      class="rounded px-10 py-2 hover:bg-gray-100 focus:outline-none dark:hover:bg-gray-700"
      @click="bookStore.toggleDrawer()"
    >
      目录
    </button>
    <button
      class="rounded px-10 py-2 hover:bg-gray-100 focus:outline-none dark:hover:bg-gray-700"
      @click="isSettingsVisible = !isSettingsVisible"
    >
      设置
    </button>
  </div>

  <div
    class="fixed right-20 top-50% flex flex-col gap-2 opacity-20 hover:opacity-100"
  >
    <div>
      <p>快捷键说明：</p>
      <p>←：上一章</p>
      <p>→：下一章</p>
      <p>Enter：打开目录</p>
      <p>B： 返回书架</p>
    </div>
  </div>

  <ReaderToc v-if="bookStore.bookTitle && !isLoadingInitial" />

  <ReaderSettings v-if="isSettingsVisible" @close="isSettingsVisible = false" />
</template>

<script setup>
  import { useRouter } from 'vue-router'
  import { useReaderLogic } from '../composables/useReaderLogic'
  import { useSettingsStore } from '../stores/settingsStore'
  import ReaderToc from '../components/ReaderToc.vue'
  import ReaderSettings from '../components/ReaderSettings.vue'

  const props = defineProps({
    bookId: {
      type: String,
      required: true,
    },
  })

  const router = useRouter()
  const settingsStore = useSettingsStore()

  const {
    bookStore,
    isLoadingInitial,
    isLoadingMore,
    nextChapterSentinelRef,
    readerContainerRef,
    isSettingsVisible,
  } = useReaderLogic(props)

  const goToBookshelf = () => {
    router.replace({ name: 'Bookshelf' })
  }
</script>
