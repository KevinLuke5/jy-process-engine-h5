import { filesView } from "../api/ossBatch";
import { isAndroid, isWxmpWebview, isWxWork } from '../utils/base_env'
import wx from 'weixin-js-sdk'
import { postJssdk } from '../api/createProcess';
import { showDialog } from 'vant'
// 优化：使用箭头函数来简化对 redirectToLogin 函数的调用
export const redirectToLogin = (): void => {
  const oriUrl = window.location.href
  let redirectUrl = oriUrl
  const originUrl = encodeURIComponent(redirectUrl)
  const appId = import.meta.env.VITE_APP_APPID
  window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${originUrl}&response_type=code&scope=snsapi_base&state=calm#wechat_redirect`
}

export const findLabelByVal = (arr: any[], val: any, valType: string): void => {
  let temp
  if (valType && valType === 'string') {
    temp = arr.find(i => i.value === val)?.label
  } else {
    temp = arr.find(i => i.value === Number(val))?.label
  }
  return temp || val
}
declare global {
  interface Window {
    wxConfiUrl: { [key: string]: any };
    simpleUrl?: string;
  }
}
// 判断wxConfig是否重复
export const isConfigRepeat = (jsApiArr:any, url:any, type = 'wx') => {
  let allInclude = true
  if (!window.wxConfiUrl) window.wxConfiUrl = {}
  jsApiArr.forEach((jsApi:any) => {
    const tempUrl = `${type}-${jsApi}-${url}`
    if (!window.wxConfiUrl[tempUrl]) {
      allInclude = false
    }
  })
  return allInclude
}

export const setConfigUrl = (jsApiArr:any, url:any, type = 'wx') => {
  jsApiArr.forEach((jsApi:any) => {
    const tempUrl = `${type}-${jsApi}-${url}`
    window.wxConfiUrl[tempUrl] = true
  })
}

export const mixinPostJssdk = (jsApiArr: any, cb?: () => void) => {
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
  }).catch(err => err)
}
export const openDefaultBrowser = () => {
  // 获取链接上的 processInstanceId
  const processInstanceId = window.location.href.split('processInstanceId=')[1].split('&')[0]
  const env = import.meta.env.VITE_NODE_ENV;
  const targetUrl = env === 'development' ? `https://pangu-test.joyoung.com/auth/#/ad90db4874ab4192875bd0db1c76a2b0?processInstanceId=${processInstanceId}` : `https://pangu.joyoung.com/console-web/#/a1cdd9dc95e44df4be9f720114db00a0?processInstanceId=${processInstanceId}`;

  (wx as any).invoke('openDefaultBrowser', {
  'url': targetUrl,
    }, function(res: any) {
    if(res.err_msg !== "openDefaultBrowser:ok"){
    //错误处理
    } else {
      wx.closeWindow()
    }
  })
}