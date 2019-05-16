import http from '@/utils/http'

//后台管理员登录
export const login = params => http.post('Admin/Users/login', params)

//获取所有用户列表
export const getUsers = params => http.get('Admin/Users/getUsers', params)

//编辑某个用户
export const edit = params => http.post('Admin/Users/edit', params)

//添加某个用户
export const add = params => http.post('Admin/Users/add', params)

