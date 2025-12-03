import ajax from '@/utils/axios'

// 登录接口
export const goLogin = (data: any) => {
  return ajax({
    url: '/cloud-auth/client/token',
    type: 'get',
    data,
  })
}

// 人员搜索
export const searchPeople = (data: any) => {
  return ajax({
    url: '/cloud-user/user',
    type: 'get',
    data,
  })
}

// 批量获取oss图片
export const batchTempUrl = (data: any) => {
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

// 获取部门数
export const getDeptTree = (data: any) => {
  return ajax({
    url: '/cloud-user/dept/tree',
    type: 'get',
    data,
  })
}

// 根据部门id获取人员信息
export const getUserByDeptId = (data: any) => {
  return ajax({
    url: '/cloud-user/user/noPage',
    type: 'get',
    data,
  })
}

// 分组列表
export const getGroupList = (data: any) => {
  return ajax({
    url: '/cloud-workflow/admin/group/list',
    type: 'get',
    data,
  })
}