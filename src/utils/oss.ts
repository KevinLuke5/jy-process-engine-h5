
import { ossUpload, filesViewV2 } from '@/api/ossBatch'
import axios from '@/utils/axiosFile'
const baseUrl = '/cloud-oss/file'

/**
 * 上传文件到OSS
 * @param {string} appModuleCode - 模块编码
 * @param {File} file - 上传的文件
 * @returns {Promise<Object>}
 *  - 返回一个包含 fileName(文件名) 和 url(oss原链接) 的Promise对象
 */
export function ossUploadFile ({ appModuleCode, file }:any) {
  const params = {
    appCode: 'camunda',  // 系统编码
    appModuleCode: appModuleCode,
    file: file
  }
  const formData = new FormData()
  Object.keys(params).forEach(key => formData.append(key, (params as { [key: string]: any })[key]))

  return new Promise((resolve, reject) => {
    ossUpload(formData).then(res => {
      if (res.code === '0') {
        const { fileName, prefixUrl, uploadPath } = res.data
        const url = `${prefixUrl}/${uploadPath}`
        resolve({
          fileName,
          url
        })
      } else {
        reject(new Error(res.message))
      }
    }).catch(err => reject(err))
  })
}

/**
 * 获取临时链接
 * @param {string} appModuleCode - 模块编码
 * @param {string} objectName - 文件原链接
 * @returns {Promise<Object>}
 *  - 返回一个包含 fileName(文件名) 和 url(oss原链接) 的Promise对象
 */
export function getFileUrlV2 ({ objectName }:any) {
  const params = {
    objectName
  }
  return new Promise((resolve, reject) => {
    filesViewV2(params).then(res => {
      if (res.code === '0') {
        const { fileUrl, originFile } = res.data
        resolve({
          fileUrl, originFile
        })
      } else {
        reject(new Error(res.message))
      }
    }).catch(err => reject(err))
  })
}
// 微服务oss上传接口-大文件上传
export const cloudOssUpload = (e:any, moduleName:any) => {
  const aimFile = e
  if (!aimFile) {
    return Promise.reject('没有选择文件')
  }
  if (aimFile.size > (20 * 1000 * 1000)) { // 不取1024是为了给网关的20mb限制留余量
    return new Promise((resolve, reject) => {
      multiUpload(e, moduleName, resolve, reject)
    })
  } else {
    return simpleUpload(e, moduleName)
  }
}

// 获取chunks
const getChunks = (e:any) => {
  const file = e
  const chunkSize = 1 * 1024 * 1024 // 5MB
  const chunks = []
  let start = 0
  while (start < file.size) {
    const end = Math.min(start + chunkSize, file.size)
    const chunk = file.slice(start, end)
    chunks.push(chunk)
    start = end
  }
  return chunks
}

// 分片大文件上传
const multiUpload = async (e:any, moduleName:any, resolve:any, reject:any) => {
  const file = e
  let paramsUploadId = ''
  let paramsUploadPath = ''
  // const loadingInstance = Loading.service({
  //   lock: true,
  //   text: '努力上传中0%',
  //   spinner: 'el-icon-loading',
  //   background: 'rgba(0, 0, 0, 0.7)'
  // })
  const chunks = getChunks(e)
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]
    const params = new FormData()
    params.append('appCode', 'camunda')
    params.append('appModuleCode', moduleName)
    params.append('file', chunk)
    params.append('partNumber', (i + 1).toString())
    params.append('totalNumber', chunks.length.toString())
    params.append('fileName', file.name)
    params.append('uploadId', paramsUploadId)
    params.append('uploadPath', paramsUploadPath)
    await axios({
      url: `${baseUrl}/split/upload`,
      type: 'post',
      data: params
    }).then(res => {
      const { fileName, uploadId, prefixUrl, uploadPath } = res.data
      if (i === 0) {
        paramsUploadId = uploadId
        paramsUploadPath = uploadPath
      }
      const percentStr = Math.floor((i / chunks.length) * 100)
      // loadingInstance.setText(`努力上传中${percentStr}%`)
      if (i === (chunks.length - 1)) {
        // loadingInstance.close()
        const url = `${prefixUrl}/${uploadPath}`
        resolve({
          fileName: file.name,
          url
        })
      }
    }).catch(err => {
      // loadingInstance.close()
      return reject(err)
    })
  }
}

// 单文件上传
const simpleUpload = (e:any, moduleName:string) => {
  const params = new FormData()
  params.append('file', e)
  params.append('appCode', 'camunda')
  params.append('appModuleCode', moduleName)
  // const loadingInstance = Loading.service({
  //   lock: true,
  //   text: 'Loading',
  //   spinner: 'el-icon-loading',
  //   background: 'rgba(0, 0, 0, 0.7)'
  // })
  return new Promise((resolve, reject) => {
    axios({
      url: `${baseUrl}/upload`,
      type: 'post',
      data: params
    }).then(res => {
      if (res.code === '0') {
        const { fileName, prefixUrl, uploadPath } = res.data
        const url = `${prefixUrl}/${uploadPath}`
        resolve({
          fileName,
          url
        })
      } else {
        reject(new Error(res.message))
      }
    }).catch(err => reject(err)).finally(() => {
      // loadingInstance.close()
    })
  })
}
