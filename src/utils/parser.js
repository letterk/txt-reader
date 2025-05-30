// src/stores/parser.js

// 用于解析小说文本，提取章节数据
export function parseBookText(text) {
  // 章节数据数组
  const chapters = []
  // 当前正在处理的章节对象
  let currentChapter = null
  // 用于存储当前章节的内容行
  let currentContentLines = []
  // 章节计数器，用于生成唯一的 id
  let chapterIdCounter = 0

  // 1. 将整个文本按行分割
  const lines = text.split('\n')

  // 2. 遍历每一行文本进行解析
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim() // 清除行首尾的空白字符

    // 3. 检查是否是章节标题行
    // 正则表达式：匹配行首（^）可能有空白字符（\s*），然后是“第”，跟着是数字或中文数字，
    // 接着是“章”、“卷”、“回”或“节”（根据你的需求，这里只保留章和卷），
    // 然后行尾可能还有其他字符，最后是行尾（$）。
    // i 标志表示忽略大小写（虽然中文不区分大小写，但习惯加上）
    // m 标志表示开启多行模式，^ 和 $ 匹配每一行的开头和结尾，而不是整个字符串的开头和结尾
    const chapterRegex =
      /^\s*第[零一二三四五六七八九十百千万\d]+\s*[章卷]\s*.*?$/

    if (chapterRegex.test(line)) {
      // 4. 如果是章节标题行
      // a. 如果当前有未完成的章节内容，先保存它
      if (currentChapter) {
        // 将之前收集的内容行合并成一个字符串，并移除空行
        currentChapter.content = currentContentLines
          .filter((contentLine) => contentLine.trim() !== '') // 过滤掉空行
          .join('\n') // 用换行符连接内容行
        chapters.push(currentChapter) // 将完成的章节添加到 chapters 数组
      }

      // b. 创建新的章节对象
      chapterIdCounter++ // 增加章节 id 计数
      currentChapter = {
        id: chapterIdCounter, // 使用计数器作为唯一 id
        title: line, // 将整行作为章节标题
        content: '', // 初始化内容为空字符串
      }
      currentContentLines = [] // 重置内容行数组
    } else {
      // 5. 如果不是章节标题行，说明是章节内容
      // 只有当 currentChapter 存在时，才将行内容添加到当前章节
      // 这是为了丢弃开头引子部分的内容
      if (currentChapter) {
        currentContentLines.push(line) // 将当前行添加到内容行数组
      }
    }
  }

  // 6. 循环结束后，处理最后一个章节的内容（如果有）
  if (currentChapter) {
    currentChapter.content = currentContentLines
      .filter((contentLine) => contentLine.trim() !== '') // 过滤掉空行
      .join('\n')
    chapters.push(currentChapter)
  }

  // 7. 返回解析后的章节数组
  // console.log('解析完成，总共章节数:', chapters.length)
  // console.log('解析后的章节数据示例:', chapters.slice(0, 5)); // 打印前5个章节看看

  return chapters
}
