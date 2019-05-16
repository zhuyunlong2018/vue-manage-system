import router from './router'
import store from './store'
import { getToken } from '@/utils/auth' // getToken from cookie
import { mainRouterMap } from './router'
import { getStorage, setStorage, removeStorage } from '@/utils/storage'
const whiteList = ['/login', '/auth-redirect']// no redirect whitelist
router.beforeEach((to, from, next) => {
  if (getToken()) { // determine if there has token
    if (to.path !== '/404') {
      setStorage('now_router', {path: to.path})
    }
    /* has token*/
    if (to.path === '/login') {
      // next()
      next({ path: '/' })
    } else {
      if (store.getters.addRouters.length === 0) {
        store.dispatch('GetUserRouter').then(() => {
          mainRouterMap[0].children.push(...store.getters.addRouters)
          router.addRoutes(mainRouterMap) // 动态添加可访问路由表
          const getTo = getStorage('now_router');
           // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          if(getTo) {
            next({ ...getTo, replace: true })
          } else {
            next({ ...to, replace: true })
          }
        })
      }
      next()
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
