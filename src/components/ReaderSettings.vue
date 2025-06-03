<template>
  <div
    class="fixed inset-0 z-2 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div
      class="w-400px flex flex-col gap-4 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800"
    >
      <h2 class="text-xl font-bold dark:text-white">阅读设置</h2>

      <div class="flex flex-col gap-2">
        <label
          class="mb-2 block text-sm text-gray-700 font-medium dark:text-gray-300"
        >
          阅读区域宽度 (px):
        </label>
        <input
          v-model.number="settingsStore.readerWidth"
          type="number"
          min="600"
          max="1200"
          step="50"
          class="w-full border border-gray-300 rounded-md p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div>
        <label
          class="mb-2 block text-sm text-gray-700 font-medium dark:text-gray-300"
        >
          自定义字体 (留空, 则是浏览器默认字体):
        </label>
        <input
          v-model="settingsStore.fontFamily"
          type="text"
          class="w-full border border-gray-300 rounded-md p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div>
        <label
          class="mb-2 block text-sm text-gray-700 font-medium dark:text-gray-300"
        >
          字体大小 (px):
        </label>
        <input
          v-model.number="settingsStore.fontSize"
          type="number"
          min="14"
          max="30"
          step="1"
          class="w-full border border-gray-300 rounded-md p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div>
        <label
          class="mb-2 block text-sm text-gray-700 font-medium dark:text-gray-300"
        >
          行高:
        </label>
        <input
          v-model.number="settingsStore.lineHeight"
          type="number"
          min="1"
          max="1.5"
          step="0.1"
          class="w-full border border-gray-300 rounded-md p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div>
        <label
          class="mb-2 block text-sm text-gray-700 font-medium dark:text-gray-300"
        >
          段落高度 (em):
        </label>
        <input
          v-model.number="settingsStore.marginBottom"
          type="number"
          min="0"
          max="1"
          step="0.1"
          class="w-full border border-gray-300 rounded-md p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div class="flex justify-end">
        <button
          class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          @click="$emit('close')"
        >
          关闭
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useSettingsStore } from '../stores/settingsStore'

  const settingsStore = useSettingsStore()

  defineEmits(['close'])
</script>
