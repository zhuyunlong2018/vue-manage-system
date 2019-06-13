import { login } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { getStorage, setStorage, removeStorage } from '@/utils/storage'
const user = {
  state: {
    userInfo: getStorage('userInfo') ? (getStorage('userInfo')) : '',
    groupname: '',
    token: getToken()
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo
    }
  },
  actions: {
    // 登录
    login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const userInfo = {
            id: response.id,
            name: response.name,
            groupId: response.group_id,
            groupName: response.group_name
          }
          setToken(response.token.access_token)
          setStorage('userInfo', userInfo)
          commit('SET_TOKEN', response.token.access_token)
          commit('SET_USER_INFO', userInfo)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    
    // 登出
    logOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_USER_INFO', '')
        removeStorage('userInfo')
        removeStorage('now_router')
        removeToken()
        resolve()
      })
    }
  }

}

export default user
