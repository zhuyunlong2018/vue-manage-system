import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'
import user from './modules/user'
import permission from './modules/permission'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    permission
  },
  state,
  actions,
  mutations,
  getters
})
