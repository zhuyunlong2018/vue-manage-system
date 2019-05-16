
import { toRoutes } from '@/utils'
import { getUserRouter } from '@/api/menu'
import { constantRouterMap } from '@/router'

const permission = {
  state: {
    routers: [],
    addRouters: [],
    menus: [],
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus
    }
  },
  actions: {
    GetUserRouter({ commit}) {
      return new Promise((resolve, reject) => {
        getUserRouter().then(response => {
          const userRouter = toRoutes(response.routers)
          commit('SET_ROUTERS', userRouter)
          commit('SET_MENUS', response.menus)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default permission
