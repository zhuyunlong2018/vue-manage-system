import request from '@/utils/request'


export function getUserRouter(query) {
  return request({
    url: 'Admin/Menus/getRouter',
    method: 'get',
    params: query
  })
}
