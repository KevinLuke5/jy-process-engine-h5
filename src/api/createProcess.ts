/*
 * @Author: zhaommalian
 * @Date: 2024-08-06 17:06:38
 * @LastEditors: “zml”
 * @LastEditTime: 2024-09-11 14:29:30
 * @Description: 
 */
import ajax from '@/utils/axios'

// 获取PTS码
export const getPtsCode = (data: any) => {
  return ajax({
    url: '/cloud-workflow/component/product/by/code',
    type: 'get',
    data,
  })
}
// 获取流程详情
export const getDetail = (data: any) => {
  return ajax({
    url: '/cloud-workflow/workspace/process/detail',
    type: 'get',
    data,
  })
}
// 我的待办
export const getGroup = (data: any) => {
  return ajax({
    url: '/cloud-workflow/admin/form/group',
    type: 'get',
    data,
  })
}
// 产品线
export const getProductLine = (data: any) => {
  return ajax({
    url: '/cloud-workflow/component/product/line/data',
    type: 'get',
    data,
  })
}
// 型号
export const getModel = (data: any) => {
  return ajax({
    url: '/cloud-workflow/component/product/model/data',
    type: 'post',
    data,
  })
}
// 配件编码
export const getParts = (data: any) => {
  return ajax({
    url: '/cloud-workflow/component/product/part/data',
    type: 'post',
    data,
  })
}
// 自定义接口
export const getAjaxData = (data: any) => {
  return ajax({
    url: '/cloud-workflow/component/select/data',
    type: 'post',
    data,
  })
}
// 提交
export const submitData = (data: any) => {
  return ajax({
    url: '/cloud-workflow/workspace/process/start',
    type: 'post',
    data,
  })
}
// jssdk 获取
export const postJssdk = (data: any) => {
  return ajax({
    url: '/jlp-basic-service/getWeComJsSdk',
    type: 'post',
    data
  })
}