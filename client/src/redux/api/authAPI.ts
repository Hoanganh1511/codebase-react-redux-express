import { AxiosError } from 'axios'
import { API, handleApiError } from './utils'
export const logout = async () => {
  try {
    const res = await API.post('/users/logout', {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return {
      error: null,
      data: res.data
    }
  } catch (e) {
    const error = e as AxiosError
    return handleApiError(error)
  }
}
export const signIn = async (formData: FormData) => {
  try {
    const res = await API.post('/users/signin', formData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return {
      error: null,
      data: res.data
    }
  } catch (e) {
    const error = e as AxiosError
    return handleApiError(error)
  }
}
export const signUp = async (formData: FormData) => {
  try {
    const res = await API.post('/users/signup', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return { error: null, data: res.data }
  } catch (e) {
    const error = e as AxiosError
    return {
      error: error,
      data: null
    }
  }
}
