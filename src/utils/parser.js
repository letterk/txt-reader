export function parseBookText(text) {
  const chapters = []

  const chapterRegex =
    /^\s*(第[零一二三四五六七八九十百千\d]+\s*[章卷]|序章)\s*.*?$/
  const lines = text.split('\n')

  let currentChapterTitle = null
  let currentContentLines = []
  let chapterIdCounter = 0

  const finalizeAndPushCurrentChapter = () => {
    if (currentChapterTitle) {
      const content = currentContentLines
        .filter((contentLine) => contentLine.trim() !== '')
        .join('\n')

      chapters.push({
        id: ++chapterIdCounter,
        title: currentChapterTitle,
        content: content,
      })
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trim()

    if (chapterRegex.test(line)) {
      finalizeAndPushCurrentChapter()

      currentChapterTitle = line
      currentContentLines = []
    } else if (currentChapterTitle !== null) {
      currentContentLines.push(line)
    }
  }

  finalizeAndPushCurrentChapter()

  return chapters
}
