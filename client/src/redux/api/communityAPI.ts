import { AxiosError } from 'axios'
import { COMMUNITY_API, handleApiError } from './utils'

export const joinCommunity = async (communityName: string) => {
  try {
    const { data } = await COMMUNITY_API.post(`/communities/${communityName}/join`)
    return { error: null, data }
  } catch (err) {
    const error = err as AxiosError
    return handleApiError(error)
  }
}

export const getJoinedCommunities = async () => {
  try {
    const { data } = await COMMUNITY_API.get('/communities/member')
    return { error: null, data }
  } catch (err) {
    const error = err as AxiosError
    return handleApiError(error)
  }
}
export const getNotJoinedCommunities = async () => {
  try {
    const { data } = await COMMUNITY_API.get('/communities/notmember')
    return { error: null, data }
  } catch (err) {
    const error = err as AxiosError
    return handleApiError(error)
  }
}
