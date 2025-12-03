import ajax from '@/utils/axios'

// 确认分阅
export const getSeparate = (data: any) => {
  return ajax({
    url: '/cloud-workflow/record/separate',
    type: 'post',
    data: data,
  })
}