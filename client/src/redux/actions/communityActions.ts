import { User } from '../types.ts'
import * as api from '../api/communityAPI.ts'
import * as types from '../constants/communityConstants.ts'
import { AxiosError } from 'axios'
import { getUserAction } from './userActions.ts'
import { getSavedPostsAction } from './postActions.ts'
export const joinCommunityAndFetchData = (communityName: string, userData: User) => async (dispatch: any) => {
  try {
    await dispatch(joinCommunityAction(communityName))
    await dispatch(getNotJoinedCommunitiesAction())
    await dispatch(getJoinedCommunitiesAction())

    if (userData) {
      await dispatch(getUserAction(userData._id))
      await dispatch(getSavedPostsAction())
    }
  } catch (error) {
    dispatch({
      type: types.JOIN_COMMUNITY_FAIL,
      payload: 'Error joining community',
      meta: {
        requiresAuth: true
      }
    })
  }
}

export const joinCommunityAction = (communityName: string) => async (dispatch: any) => {
  try {
    const { error, data } = await api.joinCommunity(communityName)
    if (error) {
      throw new Error(error)
    }
    dispatch({
      type: types.JOIN_COMMUNITY_SUCCESS,
      payload: data,
      meta: {
        requiresAuth: true
      }
    })
  } catch (err) {
    const error = err as AxiosError
    dispatch({
      type: types.JOIN_COMMUNITY_FAIL,
      payload: error.message,
      meta: {
        requiresAuth: true
      }
    })
  }
}

export const getJoinedCommunitiesAction = () => async (dispatch: any) => {
  try {
    const { error, data } = await api.getJoinedCommunities()
    if (error) {
      throw new Error(error)
    }
    dispatch({
      type: types.GET_JOINED_COMMUNITIES_SUCCESS,
      payload: data,
      meta: {
        requiresAuth: true
      }
    })
  } catch (err) {
    const error = err as AxiosError
    dispatch({
      type: types.GET_JOINED_COMMUNITIES_FAIL,
      payload: error.message,
      meta: {
        requiresAuth: true
      }
    })
  }
}
export const getNotJoinedCommunitiesAction = () => async (dispatch: any) => {
  try {
    const { error, data } = await api.getNotJoinedCommunities()
    if (error) {
      throw new Error(error)
    }
    dispatch({
      type: types.GET_NOT_JOINED_COMMUNITIES_SUCCESS,
      payload: data,
      meta: {
        requiresAuth: true
      }
    })
  } catch (err) {
    const error = err as AxiosError
    dispatch({
      type: types.GET_NOT_JOINED_COMMUNITIES_FAIL,
      payload: error.message,
      meta: {
        requiresAuth: true
      }
    })
  }
}
