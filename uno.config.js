// uno.config.js
import { defineConfig } from 'unocss'
import presetWind3 from '@unocss/preset-wind3' // 导入 UnoCSS 默认预设

export default defineConfig({
  // 使用 UnoCSS 的默认预设，包含了常见的原子化类名
  presets: [presetWind3()],
  // 可以在这里添加自定义规则、快捷方式等
  rules: [
    // 例如：定义一个垂直居中的快捷方式
    // ['flex-center', { display: 'flex', 'align-items': 'center', 'justify-content': 'center' }],
  ],
})
