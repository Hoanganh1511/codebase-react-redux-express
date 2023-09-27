import { AxiosError } from 'axios'
export type AppStore = {
  userData: User | null
  refreshToken: string | null
  accessToken: string | null
  signInError: AxiosError | null
  signUpError: AxiosError[] | null
}
export enum Role {
  'general',
  'moderator',
  'admin'
}
export type User = {
  avatar: string
  email: string
  name: string
  role: Role
  _id: string
}

export type Post = {
  _id: String
  content: String
  fileUrl: String
  community: String
  user: User
  comments: Comment[]
  likes: User[]
}
export type Comment = {
  _id: String
  content: String
  user: String
  post: String
}

// export type UserData = {
//   userData: {
//     accessToken: string
//     accessTokenUpdatedAt: string
//     refreshToken: string
//     user: {
//       avatar: string
//       email: string
//       name: string
//       role: User
//       _id: string
//     }
//   }
// }
