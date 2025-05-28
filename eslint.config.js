// eslint.config.js
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'
import unocss from '@unocss/eslint-config/flat'
export default [
  unocss,
  js.configs.recommended,

  ...pluginVue.configs['flat/recommended'],
  {
    ignores: ['node_modules', 'dist', 'build', 'public'],
  },
  {
    files: ['**/*.{js,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {},
  },

  // 确保 Prettier 配置是最后一个，以覆盖其他配置中的样式规则
  eslintConfigPrettier,
]
