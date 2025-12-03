/*
 * @Author: zhaommalian
 * @Date: 2024-08-06 17:06:38
 * @LastEditors: “zml”
 * @LastEditTime: 2024-11-27 16:30:21
 * @Description: 
 */
import ajax from '@/utils/axios'
import ajaxFile from '@/utils/axiosFile'


// 批量获取oss图片
export const filesView = (data: any) => {
  return ajax({
    url: '/cloud-oss/oss/batch_temp_url',
    type: 'post',
    data: data,
  })
}

//上传文件到oss
export const uploadFileToOss = (data: any) => {
  return ajax({
    url: '/cloud-oss/oss/temp_sts',
    type: 'post',
    data: data,
  })
}

// oss上传
export const ossUpload = (data: any) => {
  return ajaxFile({
    url: '/cloud-oss/file/upload',
    type: 'POST',
    data: data
  })
}

// 查看文件
export const filesViewV2 = (data: any) => {
  return ajax({
    url: '/cloud-oss/v2/oss/temp_url',
    type: 'post',
    data: data
  })
}