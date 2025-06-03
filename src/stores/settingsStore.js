import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const SETTINGS_STORAGE_KEY = 'userSettings'
const THEME_STORAGE_KEY = 'appTheme'

function loadSettingsFromStorage() {
  try {
    const settings = JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY))
    return settings || {}
  } catch (e) {
    console.error('加载用户设置失败:', e)
    return {}
  }
}

function saveSettingsToStorage(settings) {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
  } catch (e) {
    console.error('保存用户设置失败:', e)
  }
}

function loadThemeFromStorage() {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) || 'dark'
  } catch (e) {
    console.error('加载主题失败:', e)
    return 'dark'
  }
}

function saveThemeToStorage(theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch (e) {
    console.error('保存主题失败:', e)
  }
}

export const useSettingsStore = defineStore('settings', () => {
  const initialSettings = loadSettingsFromStorage()
  const initialTheme = loadThemeFromStorage()

  const fontFamily = ref(initialSettings.fontFamily || null)
  const fontSize = ref(initialSettings.fontSize || 22)
  const lineHeight = ref(initialSettings.lineHeight || 1.2)
  const marginBottom = ref(initialSettings.marginBottom || 0.5)
  const theme = ref(initialTheme)

  watch(
    [fontFamily, fontSize, lineHeight, marginBottom],
    ([newFontFamily, newFontSize, newLineHeight, newMarginBottom]) => {
      saveSettingsToStorage({
        fontFamily: newFontFamily,
        fontSize: newFontSize,
        lineHeight: newLineHeight,
        marginBottom: newMarginBottom,
      })
    },
    { deep: true },
  )

  watch(theme, (newTheme) => {
    saveThemeToStorage(newTheme)
  })

  function setFontFamily(value) {
    fontFamily.value = value
  }

  function setFontSize(value) {
    fontSize.value = value
  }

  function setLineHeight(value) {
    lineHeight.value = value
  }

  function setMarginBottom(value) {
    marginBottom.value = value
  }

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  return {
    fontFamily,
    fontSize,
    lineHeight,
    marginBottom,
    theme,

    setFontFamily,
    setFontSize,
    setLineHeight,
    setMarginBottom,
    toggleTheme,
  }
})
