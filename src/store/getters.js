const getters = {
  username: state => state.user.username,
  token: state => state.user.token,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  menus: state=> state.permission.menus,
}
export default getters
