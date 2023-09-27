import axios, { AxiosError } from 'axios'

export const BASE_URL = import.meta.env.VITE_API_URL
export const ADMIN_URL = `${BASE_URL}/admin`

const authInterceptor = (req: any) => {
  return req
}

const adminAuthInterceptor = (req: any) => {
  return req
}

export const API = axios.create({
  baseURL: BASE_URL
})
export const ADMIN_API = axios.create({
  baseURL: ADMIN_URL
})

export const COMMUNITY_API = axios.create({
  baseURL: BASE_URL
})

API.interceptors.request.use(authInterceptor)
ADMIN_API.interceptors.request.use(adminAuthInterceptor)
COMMUNITY_API.interceptors.request.use((req) => {
  req.headers['Content-Type'] = 'application/json'
  return authInterceptor(req)
})
export const handleApiError = async (error: AxiosError) => {
  try {
    const errorMessage = error?.response?.data.message || 'An unexpected error occured'
    const data = null
    return { error: errorMessage, data }
  } catch (err) {
    throw new Error('AN unexpected error occured')
  }
}
