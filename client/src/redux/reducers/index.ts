import { combineReducers } from 'redux'

import authReducer from './auth'
import postsReducer from './posts'
import communityReducer from './community'
import userReducer from './user'
import adminReducer from './admin'
const rootReducer = combineReducers({
  auth: authReducer,
  posts: postsReducer,
  community: communityReducer,
  user: userReducer,
  admin: adminReducer
})
export default rootReducer
