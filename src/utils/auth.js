import Cookies from 'js-cookie'

const TOKEN_KEY = "vue_admin_template_token"

// 读取cookie
export const getCookie = () => {
  return Cookies.get(TOKEN_KEY)
}

// 设置cookie
export const setCookie = (value) => {
  return Cookies.set(TOKEN_KEY, value)
}
// 清空cookie
export const removeCookie = () => {
  return Cookies.remove(TOKEN_KEY)
}
