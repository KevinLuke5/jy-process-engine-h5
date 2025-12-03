import ajax from '@/utils/axios'

// 确认分阅
export const getGroup = (data: any) => {
  return ajax({
    url: '/cloud-workflow/admin/form/group',
    type: 'get',
    data: data,
  })
}