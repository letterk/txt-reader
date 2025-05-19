/** @type {import("prettier").Config} */
const config = {
  semi: false, // 在每条语句的末尾添加分号
  singleQuote: true, // 使用单引号而不是双引号
  trailingComma: 'all', // 在ES5中有效的尾随逗号（对象、数组等）
  printWidth: 80, // 指定代码换行的行长度
  tabWidth: 2, // 指定每个缩进级别的空格数
  vueIndentScriptAndStyle: true, // 缩进Vue SFC中的<script>和<style>标签内容
  arrowParens: 'always', // 箭头函数参数总是带括号 (e.g., (x) => x)
}

export default config
