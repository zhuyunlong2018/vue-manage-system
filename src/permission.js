import router from './router'
import store from './store'
import { getToken } from '@/utils/auth' // getToken from cookie
import { mainRouterMap } from './router'
import { getStorage, setStorage } from '@/utils/storage'

/**
 * 前端路由权限校验处理
 */

const whiteList = ['/login', '/auth-redirect']// no redirect whitelist
router.beforeEach((to, from, next) => {
  if (getToken()) { // determine if there has token
    if (to.path !== '/404') {
      //将当前路由存储本地，防止刷新页面丢失
      setStorage('now_router', {path: to.path})
    }
    /* has token*/
    if (to.path === '/login') {
      // next()
      next({ path: '/' })
    } else {
      if (store.getters.addRouters.length === 0) {
        //store 中没有动态路由参数，从后端请求路由列表
        store.dispatch('GetUserRouter').then(() => {
          mainRouterMap[0].children.push(...store.getters.addRouters)
          router.addRoutes(mainRouterMap) // 动态添加可访问路由表
          const getTo = getStorage('now_router')//从本地获取当前路由
           // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          if(getTo) {
            next({ ...getTo, replace: true })
          } else {
            next({ ...to, replace: true })
          }
        })
        .catch(error => {
          
        })
      } else {
        next()
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
    }
  }
})

router.afterEach(() => {

})
