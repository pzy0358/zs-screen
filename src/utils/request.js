import axios from 'axios'
import { getCookie } from './auth'

const request = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,
  // baseURL: 'https://api-hmzs.itheima.net/api',
  timeout: 5000
})

request.interceptors.request.use(
  (config) => {
    const token = getCookie()
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default request
