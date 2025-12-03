/*
 * @Author: zhaommalian
 * @Date: 2024-08-16 10:00:12
 * @LastEditors: “zml”
 * @LastEditTime: 2024-08-22 18:46:29
 * @Description: 
 */
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index'
import pinia from './store'
import 'amfe-flexible'
import Vant from 'vant'
import 'vant/lib/index.css'
import setRem from './libs/rem'
const env = import.meta.env.VITE_NODE_ENV // 获取配置信息
import Vconsole from 'vconsole' // 引入 vconsole
if (env === 'development' || env === 'uat') new Vconsole() // 如所有环境均需开启 则不需要判断
const app = createApp(App)
app.use(router).use(Vant).use(pinia).mount('#app')
function detectDevice() {
  const userAgent = navigator.userAgent;
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    return'mobile';
  } else {
    return 'pc';
  }
}

window.isPc = detectDevice()

window.onpageshow = function() {
  if (detectDevice() === 'mobile') {
    console.log('移动端')
    window.point_diy.send_data('enter_client', JSON.stringify({userAgent: 'mobile'}))
  } else {
    console.log('PC端')
    window.point_diy.send_data('enter_client', JSON.stringify({userAgent: 'PC'}))
    window.resizeTo(800, 1600)
  }
  setRem()//在重新进入页面的时候重新设置rem
}

