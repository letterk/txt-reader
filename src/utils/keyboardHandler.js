// src/utils/keyboardHandler.js

export function setupKeyboardListener(bookStore) {
  console.log('正在设置键盘事件监听器...')

  const handleKeyDown = (event) => {
    // 检查当前 Store 是否正在加载，如果正在加载则不处理键盘事件
    if (bookStore.isLoading) {
      console.log('正在加载，忽略键盘事件')
      return // 退出函数，不处理后续逻辑
    }

    // 检查是否有章节数据，没有章节数据时不处理大部分键盘事件
    if (bookStore.chapters.length === 0 && event.key !== 'Enter') {
      console.log('没有章节数据，忽略键盘事件 (除了 Enter)')
      return // 退出函数
    }

    switch (event.key) {
      case 'ArrowLeft': // 左箭头键
        console.log('左箭头按下：尝试前往上一章')
        // 调用 Pinia Store 的 goToPrevChapter action
        bookStore.goToPrevChapter()
        // 阻止默认行为，比如浏览器可能会尝试后退页面
        event.preventDefault()
        break

      case 'ArrowRight': // 右箭头键
        console.log('右箭头按下：尝试前往下一章')
        // 调用 Pinia Store 的 goToNextChapter action
        bookStore.goToNextChapter()
        // 阻止默认行为，比如浏览器可能会尝试前进页面
        event.preventDefault()
        break

      case 'Enter': // Enter 键
        console.log('Enter 键按下：尝试切换目录抽屉')
        // 调用 Pinia Store 的 toggleDrawer action
        bookStore.toggleDrawer()
        // 阻止默认行为，比如在某些输入框中按下 Enter 会触发表单提交
        event.preventDefault()
        break

      // TODO: 可以根据需要添加其他快捷键，比如 Space 键向下滚动等
      // case ' ': // Space 键，通常用于向下滚动一页
      //   console.log('Space 键按下');
      // 这里需要调用 ReaderView 组件内部的滚动方法，有点复杂，可以作为优化项
      // event.preventDefault();
      //   break;

      default:
        // 对于我们没有处理的按键，不做任何事情，允许默认行为
        // console.log(`未处理的按键: ${event.key}`); // 如果需要可以取消注释用于调试
        break
    }
  }

  // 添加事件监听器
  window.addEventListener('keydown', handleKeyDown)
  console.log('键盘事件监听器已成功添加.')

  // 返回清理函数
  const cleanup = () => {
    window.removeEventListener('keydown', handleKeyDown)
    console.log('键盘事件监听器已成功移除.')
  }

  return cleanup
}
