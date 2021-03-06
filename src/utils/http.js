import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'

/**
 * http 请求封装库
 */

//  console.log(process.env)
// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API, // api 的 base_url
  timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['X-Api-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    // store.state.show_loading = true
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    if (response.config.method === 'options') {
      return response
    }
    // store.state.show_loading = false
    if (response.data.code !== 200) {
      Message({
        message: response.data.msg,
        type: 'error',
        duration: 5 * 1000
      })

      if(response.data.code === 410) {
        store.dispatch('logOut').then(()=>{
          router.push('/login')
        })
      }

      return Promise.reject(response.data)
    } 
    Message({
      message: response.data.msg,
      type: 'success',
      duration: 5 * 1000
    })
    return response.data.result
  },
  error => {
    // console.log('err' + error) // for debug
    Message({
      message: '未知错误',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

/**
 * 使用es6中的类，进行简单封装
 */
class http {
  // 使用async ... await
  static async get(url, params) {
    // console.log(params)
    return await service.get(url, {params}) 
  }
  static async post(url, params) {
    // console.log(params)
    return await service.post(url, params);
  }
}


export default http;