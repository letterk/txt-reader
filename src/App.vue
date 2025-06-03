<template>
  <div
    :class="settingsStore.theme === 'dark' ? 'dark' : 'light'"
    class="min-h-screen"
  >
    <router-view />

    <button
      v-if="!bookStore.isDrawerVisible"
      class="fixed left-4 top-4 h-10 w-10 rounded-full text-xl opacity-50 grayscale hover:bg-gray-100 focus:outline-none dark:hover:bg-gray-700"
      @click="settingsStore.toggleTheme"
    >
      🎨
    </button>
  </div>
</template>

<script setup>
  import { useBookStore } from './stores/bookStore'
  import { useSettingsStore } from './stores/settingsStore'

  const bookStore = useBookStore()
  const settingsStore = useSettingsStore()
</script>

<style scoped>
  .light {
    background-color: #fffbea;
    color: #323232;
  }

  .dark {
    background-color: #2d2d2d;
    color: #939393;
  }
</style>
