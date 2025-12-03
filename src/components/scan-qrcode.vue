<!--
 * @Author: churuiqi
 * @Date: 2024-08-27 15:11:18
 * @LastEditors: zml
 * @LastEditTime: 2025-03-19 20:09:52
 * @Description: 请填写简介
-->
<template>
  <div class="qrcode_img" @click="scanCode">
    <img src="https://res.joyoung.com/10/05/424f7b2d-6a43-4501-b28e-75d487d4b8e6-e753bcdf-9856-40fa-a475-56156d4be445.png" alt="scanCode">
  </div>
</template>

<script setup lang="ts">
declare global {
  interface Window {
    simpleUrl?: string;
  }
}

import { defineEmits } from 'vue'
import wx from 'weixin-js-sdk';
import getQueryParam from '@/utils/getQueryParam';
import { isAndroid, isWxmpWebview, isWxWork } from '../utils/base_env';
import { showDialog } from 'vant'
import { isConfigRepeat, setConfigUrl } from '../utils/utils';
import { postJssdk } from '../api/createProcess';
const emit = defineEmits(['getScanCode'])

    // jsApiArr: 调用的 api 的数组; cb: config 之后需要立即执行的代码
    function  mixinPostJssdk(jsApiArr: any, cb?: () => void) {
      // 安卓新版的企微(在小程序 web-view 中的 h5)需要这样改为和企微文档相反的逻辑,如果后续企微修复了,再将此逻辑更改
      const url = (isAndroid() && isWxmpWebview() && isWxWork())? window.simpleUrl : window.location.href;
      // 每个 url config 一次即可
      if (isConfigRepeat(jsApiArr, url)) {
        cb && cb();
        return;
      }
      // 获取微信 jssdk
      postJssdk({ url }).then(res => {
        // 微信 sdk 初始化
        wx.config({
          // beta: true,
          debug: false, // 开启调试模式,调用的所有 api 的返回值会在客户端 alert 出来，若要查看传入的参数，可以在 pc 端打开，参数信息会通过 log 打出，仅在 pc 端时才会打印。
          appId: res.data.appId, // 必填，企业号的唯一标识，此处填写企业号 corpid
          timestamp: res.data.timestamp, // 必填，生成签名的时间戳
          nonceStr: res.data.noncestr, // 必填，生成签名的随机串
          signature: res.data.signature, // 必填，签名，见附录 1
          jsApiList: jsApiArr // 必填，需要使用的 JS 接口列表，所有 JS 接口列表见附录 2
        });
        wx.ready(() => {
          console.info('jssdk-config-ok');
          setConfigUrl(jsApiArr, url);
          cb && cb();
        });
        wx.error((err) => {
          const funcListStr = jsApiArr.join(',');
          showDialog({ message: `${funcListStr}调用失败,可以尝试升级企业微信到最新版`});
          console.warn('err', err);
        });
      }).catch(err => err);
    }
    // 扫码
  function  scanCode() {
      mixinPostJssdk(['checkJsApi','scanQRCode'], scanCodeCallBack);
    }
  function  scanCodeCallBack() {
      // 调用企业微信扫一扫
      wx.scanQRCode({
        needResult: 1, // 默认为 0，扫描结果由微信处理，1 则直接返回扫描结果
        scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
        async success(result) {
          if (result.resultStr) {
            result.resultStr = await getQueryParam(result.resultStr);
            if (result.resultStr) {
              emit('getScanCode', result.resultStr);
            } else {
              showDialog({ message: '请扫描正确的商品码'});
            }
          } else {
            showDialog({ message: '扫码识别失败，请稍后再试！！'});
          }
        },
        // error(scanErr:any) {
        //   if (scanErr.errMsg.indexOf('function_not_exist') > 0) {
        //     showDialog({ message: '当前客户端不支持扫码，请升级后使用！！'});
        //   }
        // }
      });
    }
</script>

<style lang="less" scoped>
.qrcode_img {
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.qrcode_img img {
  width: 100%;
}
</style>../api/createProcess