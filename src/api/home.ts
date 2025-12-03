import ajax from '@/utils/axios'

// 获取流程详情
export const getDetail = (data: any) => {
  return ajax({
    url: '/cloud-workflow/workspace/process/instanceInfo',
    type: 'post',
    data: data,
  })
}

// 操作记录
export const getProcess = (data: any) => {
  return ajax({
    url: '/cloud-workflow/workspace/process/operator/log',
    type: 'post',
    data: data,
  })
}

// 同意流程
export const handleAgree = (data: any) => {
  return ajax({
    url: '/cloud-workflow/workspace/agree',
    type: 'post',
    data: data,
  })
}

// 拒绝流程
export const handleRefuse= (data: any) => {
  return ajax({
    url: '/cloud-workflow/workspace/refuse',
    type: 'post',
    data: data,
  })
}

// 撤销流程
export const handleRevoke= (data: any) => {
  return ajax({
    url: '/cloud-workflow/workspace/revoke',
    type: 'post',
    data: data,
  })
}