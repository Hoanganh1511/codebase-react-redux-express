import { AxiosError } from 'axios'
import * as api from '../api/userAPI'
import * as types from '../constants/userConstants'
import { User } from '../types'
import { getPostsAction, getSavedPostsAction } from './postActions'
export const getUserAction = (id: string) => async (dispatch: any) => {
  try {
    const { error, data } = await api.getUser(id)

    if (error) {
      throw new Error(error)
    }
    dispatch({
      type: types.GET_USER_SUCCESS,
      payload: data
    })
  } catch (e) {
    const error = e as AxiosError
    dispatch({
      type: types.GET_USER_FAIL,
      payload: error.message
    })
  }
}
export const getPublicUsersAction = () => async (dispatch: any) => {
  try {
    const { error, data } = await api.getPublicUsers()
    if (error) {
      throw new Error(error)
    }

    dispatch({
      type: types.GET_PUBLIC_USERS_SUCCESS,
      payload: data
    })
  } catch (err) {
    const error = err as AxiosError
    dispatch({
      type: types.GET_PUBLIC_USERS_FAIL,
      payload: error.message
    })
  }
}

export const followUserAndFetchData = (toFollowId: string, currentUser: User) => async (dispatch: any) => {
  try {
    await dispatch(followUserAction(toFollowId))
    await dispatch(getPublicUsersAction())
    if (currentUser) {
      await dispatch(getPostsAction())
      await dispatch(getUserAction(currentUser._id))
      await dispatch(getSavedPostsAction())
    }
  } catch (err) {
    dispatch({
      type: types.CHANGE_FOLLOW_STATUS_FAIL,
      payload: 'Failed to follow user'
    })
  }
}

export const followUserAction = (id: string) => async (dispatch: any) => {
  try {
    const { error } = await api.followUser(id)
    if (error) {
      throw new Error(error)
    }

    dispatch({
      type: types.CHANGE_FOLLOW_STATUS_SUCCESS,
      payload: {
        isFollowing: true
      }
    })
  } catch (err) {
    const error = err as AxiosError
    dispatch({
      type: types.CHANGE_FOLLOW_STATUS_FAIL,
      payload: error.message
    })
  }
}
