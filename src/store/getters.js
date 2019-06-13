const getters = {
  userInfo: state => state.user.userInfo,
  token: state => state.user.token,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  menus: state=> state.permission.menus,
  menuIds: state => state.permission.menuIds
}
export default getters
