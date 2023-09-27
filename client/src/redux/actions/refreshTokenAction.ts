import axios from 'axios'
const API = axios.create({
  baseURL: import.meta.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

API.interceptors.request.use((req) => {
  const accessToken = JSON.parse(localStorage.getItem('profile')!)?.accessToken
  if (accessToken) {
    req.headers.Authorization = `Bearer ${accessToken}`
  }
  return req
})

export const refreshTokenAction = (refreshToken: string) => async (dispatch: any) => {
  try {
  } catch (err) {}
}
