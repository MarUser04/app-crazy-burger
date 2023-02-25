import axios from 'axios'
import router from '@/router'

const AxiosConfig = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  withCredentials: true
})

const defaultTimeout = 10000

AxiosConfig.defaults.timeout = defaultTimeout

AxiosConfig.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response.status) {
      switch (error.response.status) {
        case 401:
          router.push('/login').catch(() => {})
          break
        case 403:
          router.push('/').catch(() => {})
          break
      }
      return Promise.reject(error)
    }
  }
)

export default AxiosConfig
