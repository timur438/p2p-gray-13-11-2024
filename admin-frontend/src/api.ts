import axios from 'axios'
import {authSvc} from '@/services/auth.ts'

export const api = axios.create({
  baseURL: '/api',
})

// add token if it exists
api.interceptors.request.use((config) => {
  const token = authSvc.token.value
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }

  return config
})


// handle 401 error
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      await authSvc.logout()
    }

    throw error
  },
)
