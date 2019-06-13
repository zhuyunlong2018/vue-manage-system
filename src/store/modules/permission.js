/**
 * 路由菜单权限store模块
 */
import { toRoutes } from '@/utils'
import { getUserRouter } from '@/api/menu'
import { constantRouterMap } from '@/router'

const permission = {
  state: {
    routers: [],
    addRouters: [],
    menus: [],
    menuIds: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus
    },
    SET_MENU_IDS: (state, menuIds) => {
      state.menuIds = menuIds
    }
  },
  actions: {
    GetUserRouter({ commit}) {
      return new Promise((resolve, reject) => {
        getUserRouter().then(response => {
          const userRouter = toRoutes(response.routers)
          //梳理侧边栏菜单展示，如果子集全部不在权限范围，父项不显示
          response.menus.forEach(element => {
            const children = element.children
            if (response.menuIds.indexOf(element.id) === -1) {
              //第一级菜单不在权限范围，检测是否下级菜单在权限范围
              children.forEach(ele => {
                if (response.menuIds.indexOf(ele.id) === -1) {
                  //第二级菜单也不在权限范围，检测第三级菜单是否在权限范围
                  const three = ele.children
                  three.forEach(e => {
                    //如果第三级菜单在权限范围，添加上级菜单到权限范围
                    if (response.menuIds.indexOf(e.id) > -1) {
                      response.menuIds.push(element.id, ele.id)
                    }
                  });
                } else {
                  //如果第二级菜单在权限范围，直接添加上级菜单到权限范围
                  response.menuIds.push(element.id)
                }
              });
            } else {
              //如果第一级菜单是在权限范围，需要判断第二级菜单是否在权限范围
              children.forEach(ele => {
                if (response.menuIds.indexOf(ele.id) === -1) {
                  //如果第二级菜单不在权限范围，需要判断第三级菜单是否在权限范围
                  const third = ele.children
                  third.forEach(e => {
                    //如果第三级菜单在权限范围，添加第二级菜单到权限范围中
                    if (response.menuIds.indexOf(e.id) > -1) {
                      response.menuIds.push(ele.id)
                    }
                  });
                }
              })
            }
          });
          commit('SET_ROUTERS', userRouter)
          commit('SET_MENUS', response.menus)
          commit('SET_MENU_IDS', response.menuIds)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default permission
