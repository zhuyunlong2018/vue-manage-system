import http from '@/utils/http'

//获取所有分组
export const getGroups = params => http.get('Admin/Groups/getGroups',params)

//添加一个分组
export const add = params => http.post('Admin/Groups/add', params)

//修改一个分组
export const edit = params => http.post('Admin/Groups/edit', params)