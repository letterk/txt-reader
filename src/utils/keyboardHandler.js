// src/utils/keyboardHandler.js

// 导出一个函数，这个函数负责设置和移除键盘事件监听器
// 我们让它接收 Pinia Store 的实例作为参数，这样它就可以调用 Store 的 actions
export function setupKeyboardListener(bookStore) {
  // TODO: 实现 handleKeyDown 函数和事件监听的添加和移除逻辑
  console.log('键盘事件监听器已设置 (待实现)')

  // 这个函数将用来处理按键事件
  const handleKeyDown = (event) => {
    // 暂时先打印一下按下的键
    console.log('按键按下:', event.key)
    // TODO: 根据不同的按键调用不同的 Store actions
  }

  // 添加事件监听器
  window.addEventListener('keydown', handleKeyDown)

  // 返回一个清理函数，这个函数会在组件卸载时被调用
  const cleanup = () => {
    // 移除事件监听器
    window.removeEventListener('keydown', handleKeyDown)
    console.log('键盘事件监听器已移除')
  }

  // 返回清理函数
  return cleanup
}
