// eslint.config.js
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'

export default [
  // ESLint 推荐的基本规则
  js.configs.recommended,

  // Vue 3 推荐的规则 (根据需要选择 'flat/base', 'flat/essential', 'flat/strongly-recommended', 'flat/recommended')
  // 'flat/recommended' 包含所有 essential 和 strongly-recommended 规则，更严格
  ...pluginVue.configs['flat/recommended'],

  // 自定义配置
  {
    files: ['**/*.{js,vue}'], // 应用于 JS 和 Vue 文件
    languageOptions: {
      ecmaVersion: 'latest', // 使用最新的 ECMAScript 版本
      sourceType: 'module', // 使用 ES Module
      globals: {
        // 定义全局变量
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // 在这里覆盖或添加自定义规则
    },
    ignores: ['node_modules', 'dist', 'build', 'public', 'dist'],
  },

  // 确保 Prettier 配置是最后一个，以覆盖其他配置中的样式规则
  eslintConfigPrettier,
]
