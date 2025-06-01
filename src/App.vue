<template>
  <div :class="theme === 'dark' ? 'dark' : 'light'" class="min-h-screen">
    <div class="mx-auto w-800px">
      <router-view />
    </div>

    <button
      v-if="!isDrawerVisible"
      class="fixed left-4 top-4 h-10 w-10 rounded-full text-xl opacity-50 grayscale hover:bg-gray-100 focus:outline-none dark:hover:bg-gray-700"
      @click="toggleTheme"
    >
      🎨
    </button>
  </div>
</template>

<script setup>
  import { useGlobalEffects } from './composables/useGlobalEffects'

  const { theme, toggleTheme, isDrawerVisible } = useGlobalEffects()
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
