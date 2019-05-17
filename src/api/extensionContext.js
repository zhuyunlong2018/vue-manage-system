import http from '@/utils/http'

//获取所有推广内容列表
export const getContents = params => http.get('Admin/Extension/getContents',params);

//添加一个推广内容
export const add = params => http.post('Admin/Extension/add', params)

//修改一个推广内容
export const edit = params => http.post('Admin/Extension/edit', params)

