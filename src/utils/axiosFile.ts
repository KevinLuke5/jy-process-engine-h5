import axios from 'axios'
import Cookies from 'js-cookie'
import qs from 'qs'
import getValue from '@/utils/getValue'

import { showDialog } from 'vant'
import { redirectToLogin } from './utils'

const cookieKey = 'ss_id'

const LOGIN_URL = '/cloud-auth/client/token'

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_API_URL_FILE, // api 的 base_url
  timeout: 6000, // 请求超时时间
})

// 设置请求 map
const requestTasks: Record<string, boolean> = {}
// 声明一个数组用于存储每个请求的取消函数和 axios 标识
const isLoading = (task: string): boolean => {
  // if (requestTasks[task]) {
  //   return true
  // }
  // requestTasks[task] = true
  return false
}

let urlTemp: any = ''
// request 拦截器
service.interceptors.request.use(
  (config) => {
    const user_token = Cookies.get(cookieKey)
    if (user_token) {
      config.headers['Authorization'] = user_token
    }
    config.headers['sessionid'] = user_token // 正常鉴权传sessionid 对应的value是本系统的登录token
    config.headers['Content-Type'] = 'multipart/form-data'
    urlTemp = config.url
    return config
  },
  (error) => {
    const identity = urlTemp
    if (identity && isLoading(identity)) {
      requestTasks[identity] = false
    }
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  (response) => {
    // 请求完成后 将这个请求从 pending 数组中移除
    const identity: any = response.config.url
    if (isLoading(identity)) {
      requestTasks[identity] = false
    }
    const code = getValue(response, 'data', 'code')
    const errorCode = getValue(response, 'data', 'errorCode')
    if (Number(errorCode) === 1000 || Number(errorCode) === 1001) {
      // 登录过期或者未登录时候,跳转去登录
      redirectToLogin()
      return Promise.reject('error')
    }
    if (code !== 'success' && code !== '0' && code !== 0) {
      const message = getValue(response, 'data', 'message')
      showDialog({
        message: message || '请求失败，稍后再试',
      })
      return Promise.reject('error')
    }
    // 请求成功的情况下,给登录态重置成 2 小时有效
    const user_token = Cookies.get(cookieKey)
    if (user_token) {
      const TWO_HOURS = 120 * 60 * 1000
      const expiresDate = new Date(new Date().getTime() + TWO_HOURS)
      Cookies.set(cookieKey, user_token, {
        expires: expiresDate,
      })
    }
    return response.data
  },
  (error) => {
    const identity = urlTemp
    if (isLoading(identity)) {
      requestTasks[identity] = false
    }
    const message = getValue(error, 'response', 'data', 'message')
    message && showDialog({ message })
    return Promise.reject(error)
  }
)

const ajax = (options: any): Promise<any> => {
  const params = options.data
  const url = options.url
  const type = options.type
  const timeout = options.timeout || 6000
  const upType = type.toUpperCase()
  const finalOptions: any = {
    url,
    method: upType,
  }
  if (timeout) {
    finalOptions.timeout = timeout
  }
  switch (upType) {
    case 'GET':
      finalOptions.params = params
      break
    case 'POST':
      finalOptions.data = params
      break
    case 'PUT':
      finalOptions.data = params
      break
    default:
      finalOptions.params = params
      finalOptions.paramsSerializer = (params: any) => {
        return qs.stringify(params, { indices: false })
      }
      break
  }
  const user_token = Cookies.get(cookieKey)
  if (!user_token && url !== LOGIN_URL) {
    // 没有登录态的时候 就直接跳转去登录,不再发出请求
    redirectToLogin()
    return Promise.reject('没有登录态,跳转登录')
  }
  // 如果请求 map 中有 且状态为 true，则不请求直接抛出 reject
  const task = finalOptions.url
  if (isLoading(task)) {
    return Promise.reject()
  }
  return service(finalOptions)
}

export default ajax
