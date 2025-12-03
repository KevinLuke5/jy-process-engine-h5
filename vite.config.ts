/*
 * @Author: zhaommalian
 * @Date: 2024-09-11 14:29:19
 * @LastEditors: zml
 * @LastEditTime: 2025-04-09 13:22:58
 * @Description: 
 */
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer'
import postCssPxToRem from 'postcss-pxtorem'

import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  css: {
    postcss: {
      plugins: [
        autoprefixer({
          overrideBrowserslist: [
            'Android 4.1',
            'iOS 7.1',
            'Chrome > 31',
            'ff > 31',
            'ie >= 8',
          ],
        }),
        postCssPxToRem({
          // 自适应，px>rem转换
          rootValue: 37.5, // 75表示750设计稿，37.5表示375设计稿
          propList: ['*'], // 需要转换的属性，这里选择全部都进行转换
          exclude: '/node_modules', // 忽略包文件转换rem
        }),
      ],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  base: './', // 打包路径
  server: {
    host: '0.0.0.0',
    port: 80, // 服务端口号
    open: false, // 服务启动时是否自动打开浏览器
    cors: true, // 允许跨域
    allowedHosts: [ // 新增允许访问的域名配置
      'scm-test.joyoung.com'
    ]
  },
})
