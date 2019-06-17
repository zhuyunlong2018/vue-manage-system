import http from '@/utils/http'

//后台管理员登录
export const login = params => http.post('Admin/Users/login', params)

//获取所有用户列表
export const getUsers = params => http.get('Admin/Users/getUsers', params)

//编辑某个用户
export const edit = params => http.post('Admin/Users/edit', params)

//添加某个用户
export const add = params => http.post('Admin/Users/add', params)

//编辑部门下的某个成员
export const editTeamUser = params => http.post('Admin/Users/editTeamUser', params)

//添加某个成员到自己的部门中
export const addTeamUser = params => http.post('Admin/Users/addTeamUser', params)

//获取代理的关联的所有下级用户
export const getAgentUsers = params => http.get('Admin/Team/getAgentUsers', params)

//代理给自己下级添加一名成员
export const addAgentUser = params => http.post('Admin/Team/addAgentUser', params)

//代理修改自己下级的一名成员信息
export const editAgentUser = params => http.post('Admin/Team/editAgentUser', params)
