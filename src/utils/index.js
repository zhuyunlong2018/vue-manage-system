/**
 * 公用的数据处理工具库
 */


/**
 * 递归构建vue-router
 * @param  menus 从后台获取到的前端路由列表
 */
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

/**
 * 对象、数组深拷贝
 * @param  source 需要拷贝的对象或数组
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * 递归按无限极分类整理为树状子集数据
 * @param  arr 需要整理的数组
 * @param  id 所要获取下级成员的上级id
 * @param  call 对返回数据进行包装的回调函数
 * @param  idKey 数据本身的ID
 * @param  pidKey 数据关联自身的上级ID外键
 */
export function makeChildren(arr, id=0,call=null, idKey='id', pidKey='pid'){
  const list = []
  for (const data of arr) {
    if (data[pidKey] === id) {
      data.children = makeChildren(arr, data[idKey], call, idKey, pidKey)
      if (call) {
        data = call(data)
      }
      list.push(data)
    }
  }
  return list;
}

/**
 * 递归获取无限极分类中，某个id的所有上级ID集合
 * @param arr 所有数据列表
 * @param id 需要获取元素的id
 * @param idKey 
 * @param pidKey 
 */
export function findParents(arr, id=0, idKey='id', pidKey='pid') {
  const list = []
  let data = []
  arr.forEach(element => {
      if (element[idKey] == id && id !== 0) {
          list.push(id)
          data = findParents(arr, element[pidKey])
      }
  });
  return data.concat(list);
}