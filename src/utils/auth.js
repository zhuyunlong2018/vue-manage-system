import Cookies from 'js-cookie'

/**
 * 操作cookie工具库
 */

const TokenKey = 'TV-CMS-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
