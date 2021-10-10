// https://onlymisaky.gitee.io/2019/12/27/#%E9%85%8D%E7%BD%AEeslint
// typescript 的eslint配置

module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: ['plugin:vue/essential', 'standard', '@vue/typescript'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    uni: true,
    wx: true,
    getApp: true,
    getCurrentPages: true
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    parser: '@typescript-eslint/parser'
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {}
}
