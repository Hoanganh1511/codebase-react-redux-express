import { AxiosError } from 'axios'
import * as types from '../constants/authConstants'
import { GET_COMMUNITY_SUCCESS, GET_COMMUNITY_FAIL } from '../constants/communityConstants'
import { AppStore } from '../types'

const initialState: AppStore = {
  userData: null,
  refreshToken: null,
  accessToken: null,
  signInError: null,
  signUpError: []
}
const authReducer = (state = initialState, action: any) => {
  const { type, payload } = action
  switch (type) {
    case types.SET_ACCESS_TOKEN:
      return {
        ...state,
        accessToken: payload ? payload : null
      }
    case types.SET_REFRESH_TOKEN:
      return {
        ...state,
        refreshToken: payload ? payload : null
      }
    case types.SIGNUP_SUCCESS:
      return {
        ...state,
        signInError: null,
        signUpError: [],
        successMessage: payload ? payload : null
      }
    case types.SIGNUP_FAIL:
      return {
        ...state,
        successMessage: null,
        signInError: null,
        successError: payload ? payload : null
      }
    case types.SIGNIN_SUCCESS:
      return {
        ...state,
        userData: payload ? payload.user : null,
        accessToken: payload ? payload.accessToken : null,
        refreshToken: payload ? payload.refreshToken : null,
        signInError: null,
        successMessage: payload ? payload : null
      }
    case types.SIGNIN_FAIL:
      return {
        ...state,
        successMessage: null,
        signUpError: [],
        signInError: payload ? payload : null
      }

    case types.CLEAR_MESSAGE:
      return {
        ...state,
        successMessage: null,
        signInError: null,
        signUpError: []
      }

    case types.SET_USER_DATA:
      return {
        ...state,
        userData: payload ? payload : null
      }
    default:
      return state
  }
}

export default authReducer
