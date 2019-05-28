import http from '@/utils/http'

//获取当前用户所关联的推广记录
export const getLogs = params => http.get('Admin/Extension/getLogs',params);
