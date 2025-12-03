import ajax from '@/utils/axios'

// 待办
export const getToDoList = (data: any) => {
  return ajax({
    url: '/cloud-workflow/workspace/process/toDoList',
    type: 'post',
    data: data,
  })
}

// 已发起
export const getApplyList = (data: any) => {
  return ajax({
    url: '/cloud-workflow/workspace/process/applyList',
    type: 'post',
    data: data,
  })
}

// 已办
export const getDoneList = (data: any) => {
  return ajax({
    url: '/cloud-workflow/workspace/process/doneList',
    type: 'post',
    data: data,
  })
}

// 分阅
export const getRecordList = (data: any) => {
  return ajax({
    url: '/cloud-workflow/record/list',
    type: 'post',
    data: data,
  })
}

// 待办数
export const getTaskCount = (data: any) => {
  return ajax({
    url: '/cloud-workflow/workspace/process/task/count',
    type: 'get',
    data,
  })
}