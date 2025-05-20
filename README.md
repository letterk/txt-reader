# 简单小说阅读器

这是一个基于 Vue 3、Pinia、Naive UI 和 Vite 构建的简单单页小说阅读器应用。项目旨在提供一个本地读取 txt 小说文件，并提供章节导航和基础阅读体验的功能。同时，它也是一个学习和实践前端组件开发、状态管理和虚拟列表等技术的练习项目。

## 技术栈

- **前端框架:** Vue 3 (使用 `<script setup>`)
- **状态管理:** Pinia
- **UI 组件库:** Naive UI
- **构建工具:** Vite
- **原子化 CSS:** UnoCSS
- **代码规范:** ESLint, Prettier

## 项目特性 (计划中)

- 本地读取 `.txt` 格式小说文件
- 自动识别章节标题并分割
- 章节目录导航
- 上一章/下一章导航 (支持键盘快捷键)
- 使用虚拟列表优化长章节阅读性能
- 简洁的单页应用界面

## 安装与运行

1.  **克隆仓库 (如果你已经有代码，跳过此步):**
    ```bash
    git clone <你的仓库地址>
    cd <项目目录>
    ```
2.  **安装依赖:**
    ```bash
    npm install
    ```
3.  **运行开发服务器:**

    ```bash
    npm run dev
    ```

    项目将在本地启动，通常在 `http://localhost:5173`。

4.  **构建生产版本:**
    ```bash
    npm run build
    ```
    构建后的文件会输出到 `dist` 目录。

## TODO 列表

以下是根据项目计划整理的待办事项列表，按照建议的开发阶段进行：

### 阶段 1：项目骨架和基础工具 (已完成基础配置)

- [x] 创建 Vite + Vue 3 项目
- [x] 安装并配置 Pinia
- [x] 安装并配置 Naive UI (已安装，待进一步集成)
- [x] 安装并配置 UnoCSS

### 阶段 2：数据层：Pinia Store 设计 (已完成基础结构)

- [x] 创建 Pinia Store 文件 (`src/stores/bookStore.js`)
- [x] 定义基础 State (bookTitle, chapters, currentChapterIndex, isDrawerVisible, isLoading)
- [x] 定义基础 Getters (currentChapter, currentChapterContent, isFirstChapter, isLastChapter, chaptersListForNav)
- [x] 定义基础 Actions (setBookData, goToChapter, goToPrevChapter, goToNextChapter, toggleDrawer, setLoading)

**下一步:** Review Pinia store 中的 getter 和 action 逻辑，确保它们符合预期。特别是 `chaptersListForNav` getter 和 `goToChapter` action。

### 阶段 3：文件读取和章节解析逻辑 (已完成基础功能)

- [x] 在 `App.vue` 中添加文件输入元素 (`<input type="file">`) 和触发按钮。
- [x] 实现 `handleFileChange` 函数，获取文件并调用 Pinia Action。
- [x] 创建 `src/stores/parser.js` 文件，实现 `parseBookText` 函数（包含基础章节识别逻辑）。
- [x] 在 Pinia Store 中添加异步 action `loadBook`，整合文件读取、解析和更新状态的逻辑。
- [x] 在 `App.vue` 中使用 `n-spin` 显示加载状态。

**下一步:** 测试文件读取和解析功能。使用不同的 txt 文件测试章节识别的准确性。可能需要调整 `parseBookText` 中的正则表达式以适应不同格式的小说文件。考虑如何处理解析失败的情况（例如没有识别到章节）。

### 阶段 4：基础阅读页面和导航 (已完成基础显示和导航)

- [x] 创建 `ReaderView.vue` 组件，连接 Pinia store，显示 `currentChapterContent`。
- [x] 创建 `BottomNav.vue` 组件，使用 Naive UI 按钮。
- [x] 在 `BottomNav.vue` 中绑定按钮的点击事件到 Pinia actions (`goToPrevChapter`, `goToNextChapter`, `toggleDrawer`)。
- [x] 在 `BottomNav.vue` 中使用 Pinia getters 控制按钮的 `disabled` 状态。
- [x] 在 `App.vue` 中组合 `ReaderView` 和 `BottomNav` 组件。
- [x] 更新 `App.vue` 的 `watch` 逻辑，根据书名和章节标题更新浏览器页面标题。

**下一步:** 验证基本的章节切换功能是否正常工作。手动点击上一章/下一章按钮，检查内容是否正确更新。

### 阶段 5：虚拟列表集成

- [ ] 选择一个 Vue 3 兼容的虚拟列表库 (例如 `vue-virtual-scroller`, `vue-recycle-scroller`) 并安装。
- [ ] 在 `ReaderView.vue` 或 Pinia store 中，将当前章节内容按行分割成数组，作为虚拟列表的数据源。
- [ ] 在 `ReaderView.vue` 中，用选定的虚拟列表组件替换当前简单的 `v-for` 内容渲染。
- [ ] 研究虚拟列表库的文档，找到编程控制滚动位置的方法 (例如 `scrollToItem` 或 `scrollToPosition`)。
- [ ] 在 `ReaderView.vue` 中，使用 `watch` 侦听 `bookStore.currentChapterIndex` 的变化。
- [ ] 在 `watch` 回调中，获取虚拟列表组件的实例 (使用 `ref`)，并调用其滚动方法，使阅读区域滚动到新章节的开头。

**下一步:** 这是项目的关键一步，需要仔细阅读虚拟列表库的文档，理解其工作原理并正确集成。

### 阶段 6：目录导航抽屉

- [ ] 创建 `DirectoryDrawer.vue` 组件。
- [ ] 在 `DirectoryDrawer.vue` 中使用 Naive UI 的 `n-drawer` 组件，并将其 `v-model:show` 绑定到 `bookStore.isDrawerVisible`。
- [ ] 在抽屉内部，使用 Naive UI 的目录组件 (`n-menu`) 显示 `bookStore.chaptersListForNav`。
- [ ] 为章节列表项添加 `@click` 事件监听器。
- [ ] 在点击处理函数中，调用 `bookStore.goToChapter(index)` 和 `bookStore.toggleDrawer()`。

**下一步:** 完成目录抽屉的 UI 和交互逻辑，确保点击目录项能够正确跳转章节并关闭抽屉。

### 阶段 7：键盘事件绑定

- [ ] 在 `App.vue` 的 `mounted` 钩子中，使用 `window.addEventListener('keydown', handleKeyDown)` 添加全局键盘监听器。
- [ ] 实现 `handleKeyDown` 函数，根据 `event.key` 判断按键。
- [ ] 在 `handleKeyDown` 中调用 Pinia store 的 `goToPrevChapter`, `goToNextChapter`, `toggleDrawer` actions。
- [ ] 在 `handleKeyDown` 中使用 `event.preventDefault()` 阻止默认浏览器行为（例如 Space 键）。
- [ ] 在 `App.vue` 的 `unmounted` 钩子中，使用 `window.removeEventListener('keydown', handleKeyDown)` 移除监听器。

**下一步:** 实现键盘快捷键功能，提升用户阅读体验。

### 阶段 8：优化和完善

- [ ] 增强章节解析的鲁棒性，处理更多样化的章节标题格式。
- [ ] 添加错误提示，例如文件格式不受支持或解析失败。
- [ ] 完善 UI 样式，使用 Naive UI 组件构建更美观的界面。
- [ ] (可选) 考虑添加阅读进度记忆功能。
- [ ] 进行代码审查和重构，提高代码质量。
- [ ] 编写简单的使用说明。

**下一步:** 在基础功能都完成后，进行整体优化和完善，提升项目的可用性和用户体验。

## 贡献

欢迎提出改进意见或提交 Pull Request。

## 许可证

[根据你的选择添加许可证信息，例如 MIT 或 Apache 2.0]
