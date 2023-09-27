import { clearPostsAction, getPostsAction } from '@/redux/actions/postActions'
import rootReducer from '@/redux/reducers'

import { User } from '@/redux/types'
import React, { Key, memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Post from '../post/Post'
import Home from '../../assets/home.jpg'
import * as Types from '../../redux/types'
import CommonLoading from '../loader/CommonLoading'
const MemoizedPost = memo(Post)
const LoadMoreButton = ({ onClick, isLoading }: { onClick: () => void; isLoading: boolean }) => {
  return (
    <button
      className='my-3 w-full rounded-md bg-primary p-2 text-sm font-semibold text-white hover:bg-blue-700'
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? 'Loading...' : 'Load More Posts'}
    </button>
  )
}

const MainSection = ({ userData }: { userData: User }) => {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)
  const posts = useSelector((state: ReturnType<typeof rootReducer>) => state.posts?.posts)
  const totalPosts = useSelector((state: ReturnType<typeof rootReducer>) => state.posts?.totalPosts)
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false)

  const LIMIT = 10

  useEffect(() => {
    if (userData) {
      dispatch(getPostsAction(LIMIT, 0)).finally(() => {
        setIsLoading(false)
      })
    }

    return () => {
      dispatch(clearPostsAction())
    }
  }, [userData, dispatch, LIMIT])

  const handleLoadMore = useCallback(() => {
    setIsLoadMoreLoading(true)
    dispatch(getPostsAction(LIMIT, posts.length)).finally(() => {
      setIsLoadMoreLoading(false)
    })
  }, [dispatch, LIMIT, posts.length])
  console.log('loading => ', isLoading)
  const memoizedPosts = useMemo(() => {
    return posts.map((post: Types.Post) => <MemoizedPost key={post._id as Key} post={post} />)
  }, [])
  console.log('posts', posts)
  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <CommonLoading />
      </div>
    )
  }
  return (
    <>
      <div>{memoizedPosts}</div>
      {posts.length > 0 && posts.length < totalPosts && (
        <LoadMoreButton onClick={handleLoadMore} isLoading={isLoadMoreLoading} />
      )}
      {posts.length === 0 && (
        <div className='flex flex-col items-center justify-center text-center text-gray-700'>
          <p className='py-5 font-semibold'>No posts to show. Join a community and post somethign</p>
          <img loading='lazy' src={Home} alt='No post' />
        </div>
      )}
    </>
  )
}

export default MainSection
