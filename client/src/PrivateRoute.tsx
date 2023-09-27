import React, { useEffect, useMemo, useState } from 'react'
import { Role, User } from './redux/types'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setInitialAuthState } from './redux/actions/authActions'
import Navbar from './components/shared/Navbar'
import Leftbar from './components/shared/Leftbar'
import Rightbar from './components/shared/Rightbar'
const noRightbarRoutes = [
  /\/post\/[^/]+$/,
  /\/community\/[^/]+$/,
  /\/community\/[^/]+\/report$/,
  /\/community\/[^/]+\/reported-post$/,
  /\/community\/[^/]+\/moderator$/
]
const PrivateRoute = ({ userData }: { userData: User }) => {
  const isAuthenticated = useMemo(() => {
    return (userData: User, accessToken: string) => {
      return userData && accessToken
    }
  }, [])

  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const token = localStorage.getItem('profile')
  const accessToken = JSON.parse(token!)?.accessToken
  const currentUserIsModerator = userData?.role === Role.moderator

  useEffect(() => {
    if (!isAuthenticated(userData, accessToken)) {
      dispatch(setInitialAuthState(navigate))
    }
  }, [dispatch, navigate, userData, accessToken, isAuthenticated])

  const showRighbar = !noRightbarRoutes.some((regex) => regex.test(location.pathname))

  const [showLeftbar, setShowLeftbar] = useState(false)

  const toggleLeftbar = () => {
    setShowLeftbar(!showLeftbar)
  }

  return isAuthenticated(userData, accessToken) ? (
    <div className='scroll-smooth'>
      <Navbar userData={userData} toggleLeftbar={toggleLeftbar} showLeftbar={showLeftbar} />
      <div className='md:mx-auto md:grid md:w-11/12 md:grid-cols-4 md:gap-6'>
        <Leftbar showLeftbar={showLeftbar} />
        <Outlet />

        {showRighbar ? currentUserIsModerator ? <></> : <Rightbar /> : null}
      </div>
    </div>
  ) : (
    <Navigate to='/signin' />
  )
}

export default PrivateRoute
