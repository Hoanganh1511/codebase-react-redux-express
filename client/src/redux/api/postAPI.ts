import { AxiosError } from 'axios'
import { API, handleApiError } from './utils'
export const getPosts = async (limit = 10, skip = 0) => {
  try {
    const { data } = await API.get(`/posts?limit=${limit}&skip=${skip}`)
    return { error: null, data }
  } catch (err) {
    const error = err as AxiosError
    return handleApiError(error)
  }
}
export const getSavedPosts = async () => {
  try {
    const { data } = await API.get(`/posts/saved`)
    return { error: null, data }
  } catch (e) {
    const error = e as AxiosError
    return handleApiError(error)
  }
}
