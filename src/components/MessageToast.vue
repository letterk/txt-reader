<template>
  <div
    aria-live="polite"
    class="pointer-events-none fixed inset-x-0 top-0 z-50 flex flex-col items-center p-4"
  >
    <transition-group
      name="message-toast"
      tag="div"
      class="flex flex-col items-center"
    >
      <div
        v-for="message in messages"
        :key="message.id"
        class="mt-2 max-w-xs w-full rounded px-4 py-3 text-white shadow-lg transition-all duration-300 ease-out"
        :class="[
          message.type ? `bg-${message.type}-500` : 'bg-gray-700',
          { 'cursor-pointer': message.closable },
        ]"
        role="alert"
        @click="handleMessageClick(message)"
      >
        <div class="flex items-center justify-between">
          <span>{{ message.text }}</span>
          <button
            v-if="message.closable"
            class="ml-2 h-5 w-5 flex items-center justify-center rounded-full hover:bg-black/20"
            aria-label="Close message"
            @click.stop="dismissMessage(message.id)"
          >
            &times;
          </button>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
  import { ref } from 'vue'

  const messageTypes = ['info', 'success', 'warning', 'error']

  const messages = ref([])
  let messageIdCounter = 0

  const showMessage = (
    text,
    { type = 'info', duration = 3000, closable = true, onClick = null } = {},
  ) => {
    // 验证类型
    if (!messageTypes.includes(type)) {
      type = 'info'
    }

    const id = messageIdCounter++
    const message = {
      id,
      text,
      type,
      closable,
      onClick,
      timeoutId: null,
    }

    if (duration > 0) {
      message.timeoutId = setTimeout(() => {
        dismissMessage(id)
      }, duration)
    }

    messages.value.push(message)
    return id
  }

  const dismissMessage = (id) => {
    const index = messages.value.findIndex((msg) => msg.id === id)
    if (index !== -1) {
      const message = messages.value[index]
      if (message.timeoutId) {
        clearTimeout(message.timeoutId)
      }
      messages.value.splice(index, 1)
    }
  }

  const handleMessageClick = (message) => {
    if (message.onClick) {
      message.onClick()
    }
    if (message.closable) {
      dismissMessage(message.id)
    }
  }

  // 暴露给父组件调用的方法
  defineExpose({
    showMessage,
    dismissMessage,
  })
</script>

<style scoped>
  .message-toast-move,
  .message-toast-enter-active,
  .message-toast-leave-active {
    transition: all 0.3s ease;
  }

  .message-toast-enter-from {
    opacity: 0;
    transform: translateY(-20px);
  }

  .message-toast-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }

  .message-toast-leave-active {
    position: absolute;
  }
</style>
