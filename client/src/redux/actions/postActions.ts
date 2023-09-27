import { AxiosError } from 'axios'
import * as types from '../constants/postConstants'
import * as api from '../api/postAPI'
import { API, handleApiError } from '../api/utils'

export const getSavedPostsAction = () => async (dispatch: any) => {
  try {
    const { error, data } = await api.getSavedPosts()

    if (error) {
      throw new Error(error)
    }

    dispatch({
      type: types.GET_SAVED_POSTS_SUCCESS,
      payload: data,
      meta: {
        requiresAuth: true
      }
    })
  } catch (err) {
    const error = err as AxiosError
    dispatch({
      type: types.GET_SAVED_POSTS_FAIL,
      payload: error.message,
      meta: {
        requiresAuth: true
      }
    })
  }
}
export const getPostsAction =
  (limit: number = 10, skip: number = 0) =>
  async (dispatch: any) => {
    try {
      const { error, data } = await api.getPosts(limit, skip)

      if (error) {
        throw new Error(error)
      }
      dispatch({
        type: types.GET_POSTS_SUCCESS,
        payload: {
          page: skip / limit + 1,
          posts: data.formattedPosts,
          totalPosts: data.totalPosts
        },
        meta: {
          requiresAuth: true
        }
      })
    } catch (err) {
      const error = err as AxiosError
      dispatch({
        type: types.GET_POSTS_FAIL,
        payload: error,
        meta: {
          requiresAuth: true
        }
      })
    }
  }
export const clearPostsAction = () => async (dispatch: any) => {
  dispatch({
    type: types.CLEAR_POSTS,
    meta: {
      requiresAuth: true
    }
  })
}
