import { AxiosError } from 'axios'
import { API, handleApiError } from './utils'

export const getUser = async (id: string) => {
  try {
    const { data } = await API.get(`/users/${id}`)
    return { error: null, data }
  } catch (err) {
    const error = err as AxiosError
    return handleApiError(error)
  }
}

export const getPublicUsers = async () => {
  try {
    const { data } = await API.get('/users/public-users')
    return { error: null, data }
  } catch (err) {
    const error = err as AxiosError
    return handleApiError(error)
  }
}

export const followUser = async (id: string) => {
  try {
    const { data } = await API.patch(`/users/${id}/follow`)
    return { error: null, data }
  } catch (err) {
    const error = err as AxiosError
    return handleApiError(error)
  }
}
export const unfollowUser = async (id: string) => {
  try {
    const { data } = await API.patch(`/users/${id}/unfollow`)
    return { error: null, data }
  } catch (err) {
    const error = err as AxiosError
    return handleApiError(error)
  }
}
