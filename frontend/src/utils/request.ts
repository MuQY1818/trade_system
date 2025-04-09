import axios from 'axios'
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

const request: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3002',
  timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 在这里可以添加token等认证信息
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const res = response.data
    if (res.code !== 200) {
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return response
  },
  error => {
    const message = error.response?.data?.message || error.message || '请求失败'
    if (error.response?.status === 401) {
      // 清除本地存储的认证信息
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // 重定向到登录页
      window.location.href = '/login'
    }
    ElMessage.error(message)
    return Promise.reject(error)
  }
)

export default request 