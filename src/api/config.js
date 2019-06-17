import http from '@/utils/http'

//获取充值配置列表
export const getCharges = params => http.get('Admin/Config/getCharges', params)

//添加充值配置
export const addCharge = params => http.post('Admin/Config/addCharge', params)

//编辑充值配置
export const editCharge = params => http.post('Admin/Config/editCharge', params)

//删除充值配置
export const delCharge = params => http.post('Admin/Config/delCharge', params)