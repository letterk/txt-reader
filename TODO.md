## TODO 列表

以下是根据项目计划整理的待办事项列表，按照建议的开发阶段进行：

### 阶段 1：项目骨架和基础工具

- [x] 创建 Vite + Vue 3 项目
- [x] 安装并配置 Pinia
- [x] 安装并配置 Naive UI (已安装，待进一步集成)
- [x] 安装并配置 UnoCSS

### 阶段 2：数据层：Pinia Store 设计

- [x] 创建 Pinia Store 文件 (`src/stores/bookStore.js`)
- [x] 定义基础 State (bookTitle, chapters, currentChapterIndex, isDrawerVisible, isLoading)
- [x] 定义基础 Getters (currentChapter, isFirstChapter, isLastChapter, chaptersListForNav, **currentChapterLines**) - **新增 currentChapterLines**
- [x] 定义基础 Actions (setBookData, goToChapter, goToPrevChapter, goToNextChapter, toggleDrawer, setLoading, loadBook) - **新增 loadBook**

**下一步:** Review Pinia store 中的 getter 和 action 逻辑，特别是 `chaptersListForNav` 和 `currentChapterLines` getter 以及 `goToChapter` action。**（基本已完成，可以再做最后的检查）**

### 阶段 3：文件读取和章节解析逻辑

- [x] 在 `App.vue` 中添加文件输入元素 (`<input type="file">`) 和触发按钮。
- [x] 实现 `handleFileChange` 函数，获取文件并调用 Pinia Action。
- [x] 创建 `src/stores/parser.js` 文件，实现 `parseBookText` 函数（包含基础章节识别逻辑）。
- [x] 在 Pinia Store 中添加异步 action `loadBook`，整合文件读取、解析和更新状态的逻辑。
- [x] 在 `App.vue` 中使用 `n-spin` 显示加载状态。
- [x] 测试文件读取和解析功能，使用不同的 txt 文件测试章节识别的准确性。**（已完成，可以标记为已测试基础功能）**
- [x] 将章节内容分割逻辑移动到 Pinia Store 的 getter 中。**（已完成）**

**下一步:** 考虑如何处理解析失败的情况（例如没有识别到章节），添加相应的用户提示。**（优化项，可以在后续阶段完成）**

### 阶段 4：基础阅读页面和导航

- [x] 创建 `ReaderView.vue` 组件，连接 Pinia store，显示章节内容。
- [x] 创建 `BottomNav.vue` 组件，使用 Naive UI 按钮。
- [x] 在 `BottomNav.vue` 中绑定按钮的点击事件到 Pinia actions (`goToPrevChapter`, `goToNextChapter`, `toggleDrawer`)。
- [x] 在 `BottomNav.vue` 中使用 Pinia getters 控制按钮的 `disabled` 状态。
- [x] 在 `App.vue` 中组合 `ReaderView` 和 `BottomNav` 组件。
- [x] 更新 `App.vue` 的 `watch` 逻辑，根据书名和章节标题更新浏览器页面标题。

**下一步:** 验证基本的章节切换功能是否正常工作。**（已完成基础验证）**

### 阶段 5：虚拟列表集成

- [x] 将当前章节内容按行分割成数组，作为虚拟列表的数据源。**（已将逻辑移至 Store 的 getter）**
- [x] 在 `ReaderView.vue` 中，引入并使用 Naive UI 的虚拟列表 (`n-virtual-list`)。
- [x] 在 `ReaderView.vue` 中，用 `n-virtual-list` 替换当前简单的 `v-for` 内容渲染。
- [x] 研究虚拟列表库的文档，找到编程控制滚动位置的方法 (例如 `scrollToItem` 或 `scrollToPosition`)。**（已确认 scrollTo({ position: 'top' })）**
- [x] 在 `ReaderView.vue` 中，使用 `watch` 侦听 `bookStore.currentChapterIndex` 的变化。
- [x] 在 `watch` 回调中，获取虚拟列表组件的实例 (使用 `ref`)，并调用其滚动方法，使阅读区域滚动到新章节的开头。
- [x] 调整布局，为虚拟列表提供明确的高度。**（已完成）**

**下一步:** 测试虚拟列表的渲染和滚动是否正常工作，特别是长章节的性能表现。**（需要进行详细测试）** 考虑 `item-resizable` 是否需要。

### 阶段 6：目录导航抽屉

- [x] 创建 `DirectoryDrawer.vue` 组件。
- [x] 在 `DirectoryDrawer.vue` 中使用 Naive UI 的 `n-drawer` 组件，并将其 `v-model:show` 绑定到 `bookStore.isDrawerVisible`。
- [x] 在抽屉内部，使用 Naive UI 的菜单组件 (`n-menu`) 显示 `bookStore.chaptersListForNav`。
- [x] 使用 `n-menu` 的 `value` 属性高亮当前章节，绑定到 `bookStore.currentChapterIndex`。
- [x] 为章节列表项添加 `on-update:value` 事件监听器。
- [x] 在点击处理函数中，调用 `bookStore.goToChapter(index)` 和 `bookStore.toggleDrawer()`。
- [x] 在 `App.vue` 中组合 `DirectoryDrawer` 组件。

**下一步:** 完成目录抽屉的 UI 和交互逻辑，确保点击目录项能够正确跳转章节并关闭抽屉。**（已完成本阶段所有任务）**

### 阶段 7：键盘事件绑定

- [x] 创建 `src/utils/keyboardHandler.js` 文件。
- [x] 在 `src/utils/keyboardHandler.js` 中，实现 `setupKeyboardListener` 函数，接收 Pinia Store 实例。
- [x] 在 `setupKeyboardListener` 中添加全局键盘监听器 `window.addEventListener('keydown', handleKeyDown)`。
- [x] 实现 `handleKeyDown` 函数，根据 `event.key` 判断按键（`ArrowLeft`, `ArrowRight`, `Enter`）。
- [x] 在 `handleKeyDown` 中调用对应的 Pinia store actions (`goToPrevChapter`, `goToNextChapter`, `toggleDrawer`)。
- [x] 在 `handleKeyDown` 中对处理的按键使用 `event.preventDefault()` 阻止默认行为。
- [x] 在 `setupKeyboardListener` 中返回一个清理函数 `cleanup`。
- [x] 在 `App.vue` 的 `mounted` 钩子中调用 `setupKeyboardListener` 并保存清理函数。
- [x] 在 `App.vue` 的 `unmounted` 钩子中调用清理函数。

**下一步:** 测试键盘快捷键是否正常工作。

### 阶段 8：优化和完善

- [ ] 增强章节解析的鲁棒性，处理更多样化的章节标题格式。
- [ ] 添加错误提示，例如文件格式不受支持或解析失败。
- [ ] 完善 UI 样式，使用 Naive UI 组件构建更美观的界面。
- [ ] (可选) 考虑添加阅读进度记忆功能。
- [ ] 进行代码审查和重构，提高代码质量。
- [ ] 编写简单的使用说明。

**下一步:** 在基础功能都完成后，进行整体优化和完善，提升项目的可用性和用户体验。
