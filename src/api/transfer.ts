import ajax from '@/utils/axios'

// 确认转办
export const assignee = (data: any) => {
  return ajax({
    url: '/cloud-workflow/workspace/assignee',
    type: 'post',
    data: data,
  })
}