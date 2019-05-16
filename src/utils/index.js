


//递归构建vue-router
export function toRoutes(menus) {
    const userRouters = []
    menus.forEach(menu => {
      let {
        menu_id,
        path,
        component,
        name,
        meta = {},
        icon,
        children,
        title
      } = menu
      if (children && children instanceof Array) {
        children = toRoutes(children)
      }
      meta.id = menu_id
      meta.title = title
      meta.icon = icon
  
      const userRouter = {
        path: path,
        component: (resolve) => require([`@/${component}.vue`], resolve),
        name: name,
        meta: meta,
        children: children
      }
      userRouters.push(userRouter)
    })
    return userRouters
  }