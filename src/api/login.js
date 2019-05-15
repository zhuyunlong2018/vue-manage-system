import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'Admin/Users/login',
    method: 'post',
    data
  })
}

export function register(data) {
  return request({
    url: 'admin/user/register',
    method: 'post',
    data
  })
}
