import { login } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { getStorage, setStorage, removeStorage } from '@/utils/storage'
const user = {
  state: {
    username: getStorage('username') ? (getStorage('username')) : '',
    token: getToken()
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USERNAME: (state, username) => {
      state.username = username
    }
  },
  actions: {
    // 登录
    login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          setToken(response.token.access_token)
          setStorage('username', response.name)
          commit('SET_TOKEN', response.token.access_token)
          commit('SET_USERNAME', response.name)
          // commit('SHOW_MESSAGE', '登录成功')
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
        commit('SET_USERNAME', '')
        removeStorage('username')
        removeStorage('now_router')
        removeToken()
        resolve()
      })
    }
  }

}

export default user
