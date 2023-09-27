import { isValidToken } from '@/utils/authUtils'
import * as api from '../api/authAPI'
import * as types from '../constants/authConstants'
import { refreshTokenAction } from './refreshTokenAction'
import { NavigateFunction } from 'react-router'

export const initializeAuth = () => async (dispatch: any) => {
  const accessToken = JSON.parse(localStorage.getItem('profile')!)?.accessToken
  const refreshToken = JSON.parse(localStorage.getItem('profile')!)?.refreshToken

  if (accessToken && refreshToken) {
    if (isValidToken(accessToken)) {
      dispatch(setAccessToken(accessToken))
      dispatch(setRefreshToken(refreshToken))
      dispatch(setUserData(JSON.parse(localStorage.getItem('profile')!).user))
    } else {
      await dispatch(refreshTokenAction(refreshToken))
    }
  }
}

export const setAccessToken = (accessToken: string) => async (dispatch: any) => {
  dispatch({
    type: types.SET_ACCESS_TOKEN,
    payload: accessToken
  })
}
export const setRefreshToken = (refreshToken: string) => async (dispatch: any) => {
  dispatch({
    type: types.SET_REFRESH_TOKEN,
    payload: refreshToken
  })
}
export const setUserData = (userData: any) => async (dispatch: any) => {
  dispatch({
    type: types.SET_USER_DATA,
    payload: userData
  })
}
export const setInitialAuthState = (navigate: NavigateFunction) => async (dispatch: any) => {
  await dispatch({
    type: types.LOGOUT
  })
  navigate('/signin')
}
export const clearMessage = () => async (dispatch: any) => {
  dispatch({ type: types.CLEAR_MESSAGE })
}
export const logoutAction = () => async (dispatch: any) => {
  try {
    const { data } = await api.logout()
    localStorage.removeItem('profile')
    dispatch({
      type: types.LOGOUT,
      payload: data
    })
  } catch (err) {
    dispatch({
      type: types.LOGOUT,
      payload: types.ERROR_MESSAGE
    })
  }
}

export const signUpAction =
  (formData: FormData, navigate: any, isConsentGiven = false, email: string) =>
  async (dispatch: any) => {
    try {
      localStorage.removeItem('profile')
      const response = await api.signUp(formData)
      const { error } = response
      if (error) {
        dispatch({
          type: types.SIGNUP_FAIL,
          payload: error
        })
      } else {
        if (!isConsentGiven) {
          dispatch({
            type: types.SIGNUP_SUCCESS,
            payload: types.SIGNUP_SUCCESS_MESSAGE
          })
          navigate('/signin')
        }
        if (isConsentGiven) {
          dispatch({
            type: types.SIGNUP_SUCCESS,
            payload: types.SIGNUP_SUCCESS_MESSAGE
          })
          navigate('/auth/verify', { state: email })
        }
      }
    } catch (err) {
      dispatch({
        type: types.SIGNIN_FAIL,
        payload: types.ERROR_MESSAGE
      })
    }
  }

export const signInAction = (formData: FormData, navigate: any) => async (dispatch: any) => {
  try {
    const response = await api.signIn(formData)
    const { error, data } = response
    if (error) {
      dispatch({
        type: types.SIGNIN_FAIL,
        payload: error
      })
    } else {
      const { user, accessToken, refreshToken, accessTokenUpdatedAt } = data
      const profile = {
        user,
        accessToken,
        refreshToken,
        accessTokenUpdatedAt
      }
      localStorage.setItem('profile', JSON.stringify(profile))
      dispatch({
        type: types.SIGNIN_SUCCESS,
        payload: profile
      })
      navigate('/')
    }
  } catch (err) {
    await dispatch({
      type: types.SIGNIN_FAIL,
      payload: types.ERROR_MESSAGE
    })
  }
}
