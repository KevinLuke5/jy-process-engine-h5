'use strict';

import wx from 'weixin-js-sdk'
// eslint-disable-next-line no-useless-escape
const BROWSER_PATTERN = /(MQQBrowser|MiuiBrowser|Chrome|CriOS)[\s\/]([\d\.]+)/i;
const BROWSER_NAME_DICT = {
  MQQBrowser: 'QQ',
  MiuiBrowser: 'Xiaomi',
  CriOS: 'Chrome'
};

const OS_NAME_PATTERN = /(Android|iPhone|iPad|iPod)/i;
// eslint-disable-next-line no-useless-escape
const OS_VERSION_PATTERN = /Android[\s\/]([\d\.]+)|OS ([\d_\.]+) like Mac OS X/i;
const VERSION_PATTERN = /^\d+(\.\d+)*$/;
const IPHONEX_HEIGHT = 812;

export const UA = typeof window!== 'undefined'? window.navigator.userAgent : (typeof wx!== 'undefined'? 'weixin' : '');

let sysInfo: {
  statusBarHeight:number,
  screenHeight:any,
  safeArea:any,
  system:any
}={
  statusBarHeight: 0,
  screenHeight: undefined,
  safeArea: undefined,
  system: undefined
};
// 防止 wx api 异常情况 拿不到系统信息
try {
  if (typeof wx!== 'undefined') {
    // eslint-disable-next-line no-undef
    sysInfo = (wx as any).getSystemInfoSync();
  }
} catch (err) {
  // eslint-disable-next-line no-console
  console.log('UA-err=', err);
}

export const isWeixin = (): boolean => {
  const uaStr = UA.toLowerCase();
  if (/micromessenger/i.test(uaStr) || uaStr === 'weixin') {
    return true;
  } else {
    return false;
  }
};

export const isIPXInWeixin = (): boolean => {
  const ipx = sysInfo.statusBarHeight >= 44;
  return ipx;
};

export const safeLeft = (): number => {
  const result = sysInfo.safeArea.left;
  return result;
};

export const safeRgiht = (): number => {
  const result = sysInfo.safeArea.right;
  return result;
};

export const safeTop = (): number => {
  const result = sysInfo.safeArea.top;
  return result;
};

export const safeBottom = (): number => {
  const result = sysInfo.screenHeight - sysInfo.safeArea.bottom;
  return result;
};

export const safeWidth = (): number => {
  const result = sysInfo.safeArea.width;
  return result;
};

export const safeHeight = (): number => {
  const result = sysInfo.safeArea.height;
  return result;
};

export const getOSName = (): string => {
  const matched = UA.match(OS_NAME_PATTERN);
  return matched? matched[1] : 'unknow';
};

export const isIOS = (): boolean => {
  const osName = getOSName();
  return osName === 'iPhone' || osName === 'iPod' || osName === 'iPad';
};

export const getBrowserName = (): string => {
  const matched = UA.match(BROWSER_PATTERN);
  const BROWSER_NAME_DICT: {[key: string]: string} = {};
  if (matched === null) {
    if (isIOS()) {
      if (/Safari/.test(UA)) {
        return 'Safari';
      }
      return 'iOS Webview';
    }
    return 'unknow';
  }
  return BROWSER_NAME_DICT[matched[1]]? BROWSER_NAME_DICT[matched[1]] : matched[1];
};

export const getOSVersion = (): string => {
  const matched = UA.match(OS_VERSION_PATTERN);
  const version = matched? matched[1] || matched[2] : '0.0.0';
  return version.replace(/_/g, '.');
};

export const getBrowserVersion = (): string => {
  const matched = UA.match(BROWSER_PATTERN);
  let version;
  if (matched === null) {
    if (isIOS()) {
      let versionMatched;
      if (/Safari/.test(UA)) {
        // eslint-disable-next-line no-useless-escape
        versionMatched = UA.match(/Version\/([\d\.]+)/);
      } else {
        // eslint-disable-next-line no-useless-escape
        versionMatched = UA.match(/OS ([\d_\.]+) like Mac OS X/);
      }
      version = versionMatched? versionMatched[1] : '0.0.0';
    } else {
      version = '0.0.0';
    }
  } else {
    version = matched[2];
  }
  return version.replace(/_/g, '.');
};

// os
export const isAndroid = (): boolean => {
  const inWeixin = isWeixin();
  let result = false;
  if (inWeixin && sysInfo && sysInfo.system) {
    result = sysInfo.system && sysInfo.system.toLowerCase().replace(' ', '').indexOf('android') > -1;
  } else {
    result = getOSName() === 'Android';
  }
  return result;
};

export const isIPhone = (): boolean => {
  const inWeixin = isWeixin();
  let result = false;
  if (inWeixin && sysInfo && sysInfo.system) {
    result = sysInfo.system.toLowerCase().replace(' ', '').indexOf('ios') > -1;
  } else {
    const osName = getOSName();
    result = osName === 'iPhone' || osName === 'iPod';
  }
  return result;
};

export const isIPhoneX = (): boolean => {
  const osName = getOSName();
  const inWeixin = isWeixin();
  let result = false;
  if (inWeixin) {
    result = isIPXInWeixin();
  } else {
    result = (osName === 'iPhone' || osName === 'iPod') && screen && +screen.height >= IPHONEX_HEIGHT;
  }
  return result;
};

// browser
export const isChrome = (): boolean => {
  const result = getBrowserName() === 'Chrome';
  return result;
};

export const isSafari = (): boolean => {
  const result = getBrowserName() === 'Safari';
  return result;
};

export const isIOSWebview = (): boolean => {
  const result = getBrowserName() === 'iOS Webview';
  return result;
};

/* miniprogram webview
 * 根据官方回复，ios 由于低版本系统的原因没有处理 UA，可同步获取 window.__wxjs_environment 来判断；
 * 经验证 android 微信 6.7.2 以上可以通过 UA 上的 miniprogram 标识来判断。
 * https://developers.weixin.qq.com/community/develop/doc/000688811bc278ab99f69ff1256000
 */
export const isWxmpWebview = (): boolean => {
  if (/MicroMessenger/i.test(UA)) {
    if (isAndroid() && /miniProgram/.test(UA)) {
      return true;
    }
    if (isIOS() && window.__wxjs_environment ==='miniprogram') {
      return true;
    }
  }
  return false;
};

export const isWxWork = (): boolean => {
  return /wxwork/i.test(UA.toLowerCase());
};

// versionCompare
const _isVersion = (v: string): boolean => {
  const result = VERSION_PATTERN.test(v);
  return result;
};

export const compare = (v1: any, v2: any): any => {
  if (_isVersion(v1) && _isVersion(v2)) {
    // eslint-disable-next-line no-param-reassign
    v1 = v1.toString().split('.');
    // eslint-disable-next-line no-param-reassign
    v2 = v2.toString().split('.');
    for (let i = 0, l1 = v1.length, l2 = v2.length; i < l1 || i < l2; i++) {
      const n1 = parseInt(v1[i], 10);
      const n2 = parseInt(v2[i], 10);
      if (n1 < n2) {
        return -1;
      } else if (n1 > n2) {
        return 1;
      }
    }
    return 0;
  }
  // eslint-disable-next-line no-console
  return console.error('version value is invalid');
};

export const version = (v: string): {
  gt: (compareV: string) => boolean;
  gte: (compareV: string) => boolean;
  eq: (compareV: string) => boolean;
  lte: (compareV: string) => boolean;
  lt: (compareV: string) => boolean;
} => {
  const funcObj = {
    gt (compareV: string): boolean {
      return compare(v, compareV) > 0;
    },
    gte (compareV: string): boolean {
      return compare(v, compareV) >= 0;
    },
    eq (compareV: string): boolean {
      return compare(v, compareV) === 0;
    },
    lte (compareV: string): boolean {
      return compare(v, compareV) <= 0;
    },
    lt (compareV: string): boolean {
      return compare(v, compareV) < 0;
    }
  };
  return funcObj;
};

export const os = {
  isAndroid,
  isIPhone,
  isIPhoneX,
  isIOS,
  getOSName,
  getOSVersion
};

// 仅在微信内可用
export const safeArea = {
  safeLeft,
  safeRgiht,
  safeTop,
  safeBottom,
  safeWidth,
  safeHeight
};

export const browser = {
  isChrome,
  isSafari,
  isIOSWebview, // ios 手机 微信里浏览器的 h5 页面 toDo
  isWxmpWebview, // 小程序的 webview
  getBrowserName,
  getBrowserVersion,
  isWeixin, // 微信内
  isWxWork // 企业微信
};

export default {
  os,
  safeArea,
  browser,
  version
};