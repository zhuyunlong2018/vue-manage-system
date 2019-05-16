import http from '@/utils/http'

//获取前端路由
export const getUserRouter = params => http.get('Admin/Menus/getRouter',params);

//获取系统所有菜单路由
export const getMenus = params => http.get('Admin/Menus/getMenus', params)

//添加一个菜单
export const add = params => http.post('Admin/Menus/add', params)

//修改一个菜单
export const edit = params => http.post('Admin/Menus/edit', params)