import { Post } from '@/redux/types'
import React from 'react'

const Post = ({ post }: { post: Post }) => {
  return <div>Post: {post._id}</div>
}

export default Post
