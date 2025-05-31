<template>
  <div :class="theme === 'dark' ? 'dark' : 'light'" class="min-h-screen">
    <div class="mx-auto w-800px px-4">
      <router-view />
    </div>

    <button
      class="fixed left-4 top-4 rounded bg-gray-200 px-3 py-1 text-xs dark:bg-gray-700 dark:text-white focus:outline-none"
      @click="toggleTheme"
    >
      切换主题
    </button>
  </div>
</template>

<script setup>
  import { useGlobalEffects } from './composables/useGlobalEffects'

  const { theme, toggleTheme } = useGlobalEffects()
</script>

<style scoped>
  .light {
    background-color: #ffffff;
    color: #000000;
  }

  .dark {
    background-color: #1e1e1e;
    color: #e0e0e0;
  }
</style>
