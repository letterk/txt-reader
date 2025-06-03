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

  eslintConfigPrettier,
]
