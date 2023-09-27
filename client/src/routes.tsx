import { lazy } from 'react'
import SignUp from './pages/SignUp'
import Home from './pages/Home'
export const privateRoutes = [
  {
    path: '/',
    element: <Home />
  }
]
export const publicRoutes = [
  {
    path: '/signup',
    element: <SignUp />
  }
]
